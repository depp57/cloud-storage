package diskManager

import (
	"gitlab.com/sthommet/cloud-storage/server/common/communications/dest"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
)

type NewFileInput struct {
	DiskManagerTarget dest.Destination   `json:"diskManagerTarget"`
	Metadata          files.FileMetadata `json:"metadata"`
}
