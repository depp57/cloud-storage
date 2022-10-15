package fileFragment

import (
	"bufio"
	"errors"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"net"
	"strconv"

	"github.com/google/uuid"
)

const (
	FILE_FRAGMENT_DEFAULT_SIZE = 1024
)

type defaultTCPFileMetadataReceiver struct {
	listeningPort int
	fileFragments chan files.FileFragment
	errChan       chan error
}

func NewTCPFileFragmentReceiver(port int) files.FileFragmentReceiver {
	receiver := &defaultTCPFileMetadataReceiver{
		listeningPort: port,
		fileFragments: make(chan files.FileFragment),
		errChan:       make(chan error),
	}

	go receiver.listen()

	return receiver
}

func (t *defaultTCPFileMetadataReceiver) listen() {
	listener, err := net.Listen("tcp", "0.0.0.0:"+strconv.Itoa(t.listeningPort))
	t.errChan <- err
	//TODO when to close this connection ?

	for {
		conn, err := listener.Accept()
		t.errChan <- err

		go t.handleEntrance(conn)
	}
}

func (t *defaultTCPFileMetadataReceiver) handleEntrance(conn net.Conn) {
	defer conn.Close()
	ff := files.FileFragment{
		Data: make([]byte, 0, FILE_FRAGMENT_DEFAULT_SIZE),
	}

	reader := bufio.NewReader(conn)
	uploadID := make([]byte, 0, 16)
	for i := 0; i < 16; i = i + 1 { //uuid is encoded on 16 bytes
		b, err := reader.ReadByte()
		if err != nil {
			t.errChan <- err
		}

		uploadID[i] = b
	}
	UUID, err := uuid.ParseBytes(uploadID)
	if err != nil {
		t.errChan <- errors.New("failed to parse bytes into uploadID UUID")
	}
	ff.UploadID = UUID.String()

	_, err = reader.Read(ff.Data)
	if err != nil {
		t.errChan <- err
	}

	t.fileFragments <- ff
}

func (t *defaultTCPFileMetadataReceiver) Get() (files.FileFragment, error) {
	ff := <-t.fileFragments

	var err error = nil
	if len(t.errChan) > 0 {
		err = <-t.errChan //TODO empty all errors + send them all
	}

	return ff, err
}
