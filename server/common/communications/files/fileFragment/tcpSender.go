package fileFragment

import (
	"encoding/binary"
	"errors"
	"github.com/google/uuid"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/dest"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
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

	bytes := [16]byte(uploadID)
	_, err = conn.Write(bytes[:])
	if err != nil {
		return errors.New("failed to write UploadID: " + err.Error())
	}

	dataLength := uint32(len(ff.Data))
	dataLengthBytes := make([]byte, 4)
	binary.LittleEndian.PutUint32(dataLengthBytes, dataLength)
	_, err = conn.Write(dataLengthBytes)
	if err != nil {
		return errors.New("failed to write dataLength: " + err.Error())
	}

	_, err = conn.Write(ff.Data)
	if err != nil {
		return errors.New("failed to write Data: " + err.Error())
	}

	return nil
}
