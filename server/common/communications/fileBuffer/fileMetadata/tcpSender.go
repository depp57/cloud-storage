package fileMetadata

import (
	"encoding/json"
	"net"
	"strconv"
	"time"
)

func NewTCPFileMetadataSender(hostname string, port int) FileMetadataSender {
	return &defaultTCPFileMetadataSender{
		targetHostname: hostname,
		targetPort:     port,
	}
}

type defaultTCPFileMetadataSender struct {
	targetHostname string
	targetPort     int
}

func (t *defaultTCPFileMetadataSender) SendFileMetadata(metadata FileMetadata) error {
	bytes, err := json.Marshal(metadata)
	if err != nil {
		return err
	}

	conn, err := net.Dial("tcp", t.targetHostname+":"+strconv.Itoa(t.targetPort))
	if err != nil {
		return err
	}
	defer conn.Close()

	_ = conn.SetDeadline(time.Now().Add(time.Second * 30))

	msg := append(bytes, ASCII_END_OF_TRANSMISSION)

	_, err = conn.Write(msg)
	if err != nil {
		return err
	}

	return nil
}
