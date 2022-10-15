package fileFragment

import (
	"errors"
	"github.com/sventhommet/cloud-storage/server/common/communications/files"
	"net"
	"strconv"

	"github.com/google/uuid"
)

func NewTCPFileFragmentSender(hostname string, port int) files.FileFragmentSender {
	return &defaultTCPFileFragmentSender{
		targetHostname: hostname,
		targetPort:     port,
	}
}

type defaultTCPFileFragmentSender struct {
	targetHostname string
	targetPort     int
}

func (s *defaultTCPFileFragmentSender) Send(ff files.FileFragment) error {
	uploadID, err := uuid.Parse(ff.UploadID)
	if err != nil {
		return errors.New("failed to parse UploadID as UUID")
	}

	conn, err := net.Dial("tcp", s.targetHostname+":"+strconv.Itoa(s.targetPort))
	if err != nil {
		return err
	}
	defer conn.Close()

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
