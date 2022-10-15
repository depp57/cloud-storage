package services

import (
	"errors"
	"github.com/sventhommet/cloud-storage/server/clientEndpoint/database"
	"github.com/sventhommet/cloud-storage/server/common/communications/files"
	"github.com/sventhommet/cloud-storage/server/common/log"
)

type Uploader interface {
	UploadRequest(userID string, filePath string, size int, fileCheckSum string) (chunckSize int)
	UploadFileFragment(uploadID string, data []byte) error
	GetNewStatus(userId string, filePath string) (string, error) // used by IO-layer to notify client about uploading status
}

type defaultUploader struct {
	fileFragmentSender files.FileFragmentSender
	db                 database.FileDbPort
}

func NewDefaultUploader(ffSender files.FileFragmentSender) Uploader {
	return &defaultUploader{
		fileFragmentSender: ffSender,
	}
}

func (u *defaultUploader) UploadRequest(userID string, filePath string, size int, fileCheckSum string) (chunckSize int) {
	//targetDisk := u.db.WhereToSave(size)
	return 0
}

func (u *defaultUploader) UploadFileFragment(uploadID string, data []byte) error {
	err := u.fileFragmentSender.Send(files.FileFragment{
		UploadID: uploadID,
		Data:     data,
	})
	if err != nil {
		log.Warn(err.Error())
		return errors.New("failed to send file fragment to diskManager")
	}

	return nil
}

func (u *defaultUploader) GetNewStatus(userId string, filePath string) (string, error) {
	return "DONE", nil //TODO
}
