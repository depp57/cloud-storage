package fileFragment

type FileFragment struct {
	UploadID string // must be uuid4
	Data     []byte
}

func (ff *FileFragment) GetUploadID() string {
	return "" //TODO
}

type FileFragmentSender interface {
	Send(ff FileFragment) error
}

type FileFragmentReceiver interface {
	Get() (FileFragment, error)
}
