package ports

import "io"

type DiskPort interface {
	GetDiskName() string
	GetDiskSize() uint32
	GetDiskLeftSpace() uint32

	GetFileWriter(fileId string) (io.WriteCloser, error)
	GetFileReader(fileId string) (io.ReadCloser, error)
	RemoveFile(fileId string) error
}
