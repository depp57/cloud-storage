package files

import "gitlab.com/sthommet/cloud-storage/server/common/communications/dest"

type FileFragment struct { //TODO package "entity" ?
	UploadID string // must be uuid4
	Data     []byte
}

/*
- Protocol description -

16 bytes : uuid4 of uploadID
4 bytes : data length
--- data ---

*/

type FileFragmentSender interface {
	Send(dest dest.Destination, ff FileFragment) error
}

type FileFragmentReceiver interface {
	Get() (FileFragment, error)
}
