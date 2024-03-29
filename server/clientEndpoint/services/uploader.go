package services

import (
	"errors"
	"github.com/google/uuid"
	httpClient "gitlab.com/sthommet/cloud-storage/server/clientEndpoint/httpClients"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services/entities"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services/ports"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/dest"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"math"
	"path"
	"strings"
)

type Uploader interface {
	UploadRequest(userID string, filePath string, size uint32, fileCheckSum uint32) (uploadIDStr string, chunckSize uint, err error)
	UploadFileFragment(uploadID string, data []byte) error
	GetCurrentStatus(userId string, filePath string) (string, error) // used by IO-layer to notify client about uploading status

	AcknowledgeUploading(metadata files.FileMetadata) error
}

type defaultUploader struct {
	db                 ports.FileDbPort
	fileFragmentSender files.FileFragmentSender
	diskClient         httpClient.DiskManagerClient

	uploadings map[string]entities.Uploading
}

func NewDefaultUploader(db ports.FileDbPort, diskClient httpClient.DiskManagerClient, fragmentSender files.FileFragmentSender) Uploader {
	return &defaultUploader{
		db:                 db,
		diskClient:         diskClient,
		fileFragmentSender: fragmentSender,
		uploadings:         make(map[string]entities.Uploading),
	}
}

func (u *defaultUploader) UploadRequest(userID string, filePath string, size uint32, fileCheckSum uint32) (uploadIDStr string, chunckSize uint, err error) {
	var disks []entities.DiskInfo
	disks, err = u.db.GetAllDisks()
	if err != nil {
		return "", 0, err //TODO wrap error
	}

	// first disk is the one with the most space
	if size >= disks[0].SpaceLeft {
		log.Fatal("system full !")
		return "", 0, errors.New("no space left on device")
	}
	targetDisk := disks[0]

	filePath = strings.TrimPrefix(strings.TrimSuffix(filePath, "/"), "/") //TODO what is that ?

	uploadID, err := uuid.NewRandom()
	if err != nil {
		return "", 0, err //TODO wrap error
	}
	uploadIDStr = uploadID.String()
	chunckSize = u.computeChunkSize(size)

	destination, err := dest.NewDestination(targetDisk.IP)
	if err != nil {
		return "", 0, err //TODO wrap error
	}

	metadata := files.FileMetadata{
		UploadID:  uploadID.String(),
		UserID:    userID,
		Path:      path.Dir(filePath),
		Filename:  path.Base(filePath),
		Size:      size,
		ChunkSize: chunckSize,
		CRC:       fileCheckSum,
	}

	err = u.diskClient.SendUploadingRequest(destination, metadata)
	if err != nil {
		return "", 0, err
	}

	u.uploadings[uploadID.String()] = entities.Uploading{ //TODO when does it get cleaned ?
		DiskManager: destination,
		Metadata:    metadata,
	}
	return
}

func (f *defaultUploader) computeChunkSize(fileSize uint32) uint {
	return uint(math.Floor(float64(fileSize) / 10.0)) //TODO
}

func (u *defaultUploader) UploadFileFragment(uploadID string, data []byte) error {
	uploading, found := u.uploadings[uploadID]
	if !found {
		return errors.New("uploadID not found")
	}

	uploading.DiskManager.Port += 1 // fileFragment receiver port is set to API port + 1

	err := u.fileFragmentSender.Send(uploading.DiskManager, files.FileFragment{
		UploadID: uploadID,
		Data:     data,
	})
	if err != nil {
		log.Warn(err.Error())
		return errors.New("failed to send file fragment to diskManager")
	}

	return nil
}

func (u *defaultUploader) GetCurrentStatus(userId string, filePath string) (string, error) {
	for _, uploading := range u.uploadings {
		if uploading.Metadata.UserID == userId && uploading.Metadata.Path == path.Dir(filePath) && uploading.Metadata.Filename == path.Base(filePath) {

			if uploading.Finished {
				return "DONE", nil
			} else {
				return getCurrentStatus(uploading)
			}
		}
	}

	return "", errors.New("no current uploading found for this {userId, filePath}")
}

func getCurrentStatus(uploading entities.Uploading) (string, error) {
	return "50%", nil //TODO ask DiskManager
}

func (u *defaultUploader) AcknowledgeUploading(metadata files.FileMetadata) error {
	uploading, found := u.uploadings[metadata.UploadID]
	if !found {
		return errors.New("no current uploading found for this uploadID")
	}

	uploading.Finished = true
	u.uploadings[metadata.UploadID] = uploading

	//TODO push request to client ?

	return nil
}
