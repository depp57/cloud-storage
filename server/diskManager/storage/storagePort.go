package storage

type StoragePort interface {
	GetDiskName() string
	GetDiskSize() int
	GetDiskLeftSpace() int

	WriteFile(fileId string, data []byte) error
	RemoveFile(fileId string) error
	ReadFile(fileId string) (data []byte, size int64)
}
