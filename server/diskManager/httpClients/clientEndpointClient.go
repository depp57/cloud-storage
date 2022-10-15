package httpClients

import (
	"bytes"
	"encoding/json"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/dest"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"io"
	"net/http"
)

var (
	ROUTE = "/files"
)

type ClientEndpointClient interface {
	AcknowledgeWrittenFile(dest dest.Destination, metadata files.FileMetadata) error
}

type defaultCEClient struct {
	client http.Client
}

func NewDefaultClientEndpointClient() ClientEndpointClient {
	return &defaultCEClient{
		client: http.Client{},
	}
}

func (d defaultCEClient) AcknowledgeWrittenFile(dest dest.Destination, metadata files.FileMetadata) error {
	marshaled, err := json.Marshal(metadata)
	if err != nil {
		return err //TODO wrap error
	}

	req, err := http.NewRequest(http.MethodPost, dest.GetHostAndPort()+ROUTE, io.NopCloser(bytes.NewReader(marshaled)))
	if err != nil {
		return err //TODO wrap error
	}

	_, err = d.client.Do(req)
	if err != nil {
		return err //TODO wrap error
	}

	return nil
}
