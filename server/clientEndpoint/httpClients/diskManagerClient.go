package httpClients

import (
	"bytes"
	"encoding/json"
	"errors"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/dest"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/diskManager"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"io"
	"net/http"
	"net/url"
)

type DiskManagerClient interface {
	SendUploadingRequest(dest dest.Destination, metadata files.FileMetadata) error
}

type defaultDMClient struct {
	client http.Client
}

func NewDefaultDiskManagerClient() DiskManagerClient {
	return &defaultDMClient{
		client: http.Client{},
	}
}

func (c defaultDMClient) SendUploadingRequest(dest dest.Destination, metadata files.FileMetadata) error {
	input := diskManager.NewFileInput{
		DiskManagerTarget: dest,
		Metadata:          metadata,
	}

	marshaled, err := json.Marshal(input)
	if err != nil {
		return err //TODO wrap error
	}

	targetUrl, err := url.Parse(dest.GetURL() + "/files/metadata")
	if err != nil {
		return err //TODO wrap error
	}

	req := &http.Request{}
	req.URL = targetUrl
	req.Method = http.MethodPut
	req.Body = io.NopCloser(bytes.NewReader(marshaled))

	resp, err := c.client.Do(req)
	if err != nil {
		return err //TODO wrap error
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return errors.New("error from DiskManager : " + string(body))
	}

	return nil
}
