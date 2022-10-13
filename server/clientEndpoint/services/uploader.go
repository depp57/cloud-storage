package services

import (
	"errors"
	"github.com/sventhommet/cloud-storage/server/common/communications/fileBuffer/fileFragment"
	"github.com/sventhommet/cloud-storage/server/common/log"
)

type Uploader interface {
	UploadRequest(userID string, filePath string, size int, fileCheckSum string) (chunckSize int)
	UploadFileFragment(uploadID string, data []byte) error
	GetNewStatus(userId string, filePath string) (string, error) // used by IO-layer to notify client about uploading status
}

type defaultUploader struct {
	fileFragmentSender fileFragment.FileFragmentSender
}

func NewDefaultUploader(ffSender fileFragment.FileFragmentSender) Uploader {
	return &defaultUploader{
		fileFragmentSender: ffSender,
	}
}

func (u *defaultUploader) UploadRequest(userID string, filePath string, size int, fileCheckSum string) (chunckSize int) {
	return 0
}

func (u *defaultUploader) UploadFileFragment(uploadID string, data []byte) error {
	err := u.fileFragmentSender.Send(fileFragment.FileFragment{
		UploadID: uploadID,
		Data:     data,
	})
	if err != nil {
		log.Warn(err.Error())
		return errors.New("failed to send file fragment to fileBuffer")
	}

	return nil
}

func (u *defaultUploader) GetNewStatus(userId string, filePath string) (string, error) {
	return "DONE", nil //TODO
}
