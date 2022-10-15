package filesystem

import (
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"io"
	"os"
	"strings"

	"golang.org/x/sys/unix"
)

type FsStorage struct {
	storagePath  string
	confFileName string
	diskName     string
}

func NewFsStorage() *FsStorage {
	fs := &FsStorage{}

	fs.storagePath = os.Getenv("FS_STORAGE_PATH")
	if fs.storagePath == "" {
		log.Fatal("Please set FS_STORAGE_PATH var")
	}
	fs.confFileName = os.Getenv("FS_CONF_FILE_NAME")
	if fs.confFileName == "" {
		log.Fatal("Please set FS_CONF_FILE_NAME var")
	}

	// ensure the path is a directory itself and not his children
	fs.storagePath = strings.TrimSuffix(fs.storagePath, "/")

	if _, err := os.Stat(fs.storagePath); os.IsNotExist(err) {
		if errMkdir := os.Mkdir(fs.storagePath, 0755); errMkdir != nil {
			panic(errMkdir)
		}
	}

	if _, err := os.Stat(fs.storagePath + "/files"); os.IsNotExist(err) {
		if errMkdir := os.Mkdir(fs.storagePath+"/files", 0755); errMkdir != nil {
			panic(errMkdir)
		}
	}

	if _, err := os.Stat(fs.storagePath + "/data"); os.IsNotExist(err) {
		if errMkdir := os.Mkdir(fs.storagePath+"/data", 0755); errMkdir != nil {
			panic(errMkdir)
		}
	}

	// Read filesystem configuration file -> get disk's name
	var buf, err = os.ReadFile(fs.storagePath + "/" + fs.confFileName)
	if err != nil {
		panic(err.Error())
	}
	fs.diskName = string(buf)

	return fs
}

func (fs *FsStorage) GetFileWriter(fileId string) (io.WriteCloser, error) {
	file, err := os.OpenFile(fs.storagePath+"/files/"+fileId, os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		return nil, err
	}

	return file, nil
}

func (fs *FsStorage) GetFileReader(fileId string) (io.ReadCloser, error) {
	file, err := os.Open(fs.storagePath + "/files/" + fileId)
	if err != nil {
		return nil, err
	}

	return file, nil
}

func (fs *FsStorage) RemoveFile(fileId string) error {
	var err = os.Remove(fs.storagePath + "/files/" + fileId)

	return err
}

func (fs *FsStorage) GetDiskName() string {
	return fs.diskName
}

func (fs *FsStorage) GetDiskSize() uint32 {
	var stat unix.Statfs_t
	unix.Statfs(fs.storagePath, &stat)

	return uint32(stat.Blocks * uint64(stat.Bsize) / 1024 / 1024)
}

func (fs *FsStorage) GetDiskLeftSpace() uint32 {
	var stat unix.Statfs_t
	unix.Statfs(fs.storagePath, &stat)

	return uint32(stat.Bavail * uint64(stat.Bsize) / 1024 / 1024)
}
