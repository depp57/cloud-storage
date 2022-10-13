package fileMetadata

import (
	"bufio"
	"encoding/json"
	"net"
	"strconv"
)

type defaultTCPFileMetadataReceiver struct {
	listeningPort int
	fileMetadata  chan FileMetadata
	errChan       chan error
}

func NewTCPFileMetadataReceiver(port int) FileMetadataReceiver {
	receiver := &defaultTCPFileMetadataReceiver{
		listeningPort: port,
		fileMetadata:  make(chan FileMetadata),
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
	reader := bufio.NewReader(conn)
	read, err := reader.ReadBytes(ASCII_END_OF_TRANSMISSION)
	if err != nil {
		t.errChan <- err
	}

	metadata := FileMetadata{}
	err = json.Unmarshal(read, &metadata)
	if err != nil {
		t.errChan <- err
	}

	t.fileMetadata <- metadata
}

func (t *defaultTCPFileMetadataReceiver) GetFileMetadata() (FileMetadata, error) {
	var metadata FileMetadata
	metadata = <-t.fileMetadata

	var err error = nil
	if len(t.errChan) > 0 {
		err = <-t.errChan //TODO empty all errors + send them all
	}

	return metadata, err
}
