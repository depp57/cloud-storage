package database

const TOKEN_SIZE = 20
const FILE_ID_LENGTH = 10

type File struct {
	name     string
	fileType string
	diskName string
}

type Database interface {
	GetFileId(userId string, fullpath string) string

	// RegisterFile registers a file into database
	//Must verify that the file isn't already existing
	RegisterFile(userId string, fullpath string, diskName string) (fileId string)

	UnRegisterFile(userId string, fullpath string) error

	RegisterWorkingDisk(diskName string, ip string)
}
