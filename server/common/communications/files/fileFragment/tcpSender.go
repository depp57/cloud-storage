package fileFragment

import (
	"errors"
	"github.com/google/uuid"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/dest"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"net"
)

func NewTCPFileFragmentSender() files.FileFragmentSender {
	return &defaultTCPFileFragmentSender{}
}

type defaultTCPFileFragmentSender struct {
}

func (s *defaultTCPFileFragmentSender) Send(dest dest.Destination, ff files.FileFragment) error {
	uploadID, err := uuid.Parse(ff.UploadID)
	if err != nil {
		return errors.New("failed to parse UploadID as UUID")
	}

	conn, err := net.Dial("tcp", dest.GetHostAndPort())
	if err != nil {
		return err
	}
	defer conn.Close()
	log.Debug("connection with peer established")

	bytes := [16]byte(uploadID)
	_, err = conn.Write(bytes[:])
	if err != nil {
		return errors.New("failed to write UploadID")
	}

	_, err = conn.Write(ff.Data)
	if err != nil {
		return errors.New("failed to write Data")
	}

	return nil
}
