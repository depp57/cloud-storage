package entities

import (
	"gitlab.com/sthommet/cloud-storage/server/common/communications/dest"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"time"
)

type File struct {
	Path   string `json:"path,omitempty"`
	Type   string `json:"type,omitempty"`
	UserID string `json:"userID,omitempty"`
	DiskID string `json:"diskId,omitempty"`
}

type User struct {
	Id               string
	Name             string
	Token            string
	Token_expiration time.Time
	//password_hash string
}

type DiskInfo struct {
	DiskName  string
	IP        string
	SpaceLeft uint32
}

type Uploading struct {
	DiskManager dest.Destination
	Metadata    files.FileMetadata
	Finished    bool
}
