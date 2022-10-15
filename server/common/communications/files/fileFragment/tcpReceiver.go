package fileFragment

import (
	"bufio"
	"errors"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"net"
	"strconv"

	"github.com/google/uuid"
)

const (
	FILE_FRAGMENT_DEFAULT_SIZE = 1024
)

type defaultTCPFileMetadataReceiver struct {
	listener      net.Listener
	fragmentsChan chan files.FileFragment
	errChan       chan error
	finalChan 	  chan interface{}
}

func NewTCPFileFragmentReceiver(port int) (files.FileFragmentReceiver, error) {
	receiver := &defaultTCPFileMetadataReceiver{
		fragmentsChan: make(chan files.FileFragment),
		errChan:       make(chan error),
		finalChan :    make(chan interface{}),
	}
	receiver.mergeChannels()

	var err error
	receiver.listener, err = net.Listen("tcp", "0.0.0.0:"+strconv.Itoa(port))
	if err != nil {
		return nil, err //TODO wrap error
	}
	//TODO when to close this connection ?

	go receiver.accept()

	return receiver, nil
}

func (t *defaultTCPFileMetadataReceiver) accept() {
	for {
		conn, err := t.listener.Accept()
		if err != nil {
			t.errChan <- err
		}

		log.Debug("new fragment received")
		go t.handleEntrance(conn)
	}
}

func (t *defaultTCPFileMetadataReceiver) handleEntrance(conn net.Conn) {
	defer conn.Close()
	ff := files.FileFragment{
		Data: make([]byte, FILE_FRAGMENT_DEFAULT_SIZE),
	}

	reader := bufio.NewReader(conn)
	uploadID := make([]byte, 16)
	for i := 0; i < 16; i = i + 1 { //uuid is encoded on 16 bytes
		b, err := reader.ReadByte()
		if err != nil {
			t.errChan <- err
		}

		uploadID[i] = b
	}

	UUID, err := uuid.FromBytes(uploadID)
	if err != nil {
		t.errChan <- errors.New("failed to parse bytes into uploadID UUID")
	}
	ff.UploadID = UUID.String()

	n, err := reader.Read(ff.Data)
	if err != nil {
		t.errChan <- err
	}
	ff.Data = ff.Data[0:n] // eliminates unread bytes from slice

	t.fragmentsChan <- ff
}

func (t *defaultTCPFileMetadataReceiver) Get() (files.FileFragment, error) {
	data := <- t.finalChan

	err, isErr := data.(error)
	if isErr {
		return files.FileFragment{}, err
	}

	return data.(files.FileFragment), nil
}

func (t *defaultTCPFileMetadataReceiver) mergeChannels() {
	go func() {
		for {
			t.finalChan <- <- t.fragmentsChan
		}
	}()
	go func() {
		for {
			t.finalChan <- <- t.errChan
		}
	}()
}