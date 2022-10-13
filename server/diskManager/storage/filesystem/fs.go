package filesystem

import (
	"os"

	"golang.org/x/sys/unix"
)

const FS_STORAGE_PATH = "/var/lib/cloud-storage"
const FS_CONF_FILE = "disk-info.conf"

type FsStorage struct {
	diskName string
}

func NewFsStorage() *FsStorage {
	if _, err := os.Stat(FS_STORAGE_PATH); os.IsNotExist(err) {
		if errMkdir := os.Mkdir(FS_STORAGE_PATH, 0755); errMkdir != nil {
			panic(errMkdir)
		}
	}

	if _, err := os.Stat(FS_STORAGE_PATH + "/files"); os.IsNotExist(err) {
		if errMkdir := os.Mkdir(FS_STORAGE_PATH+"/files", 0755); errMkdir != nil {
			panic(errMkdir)
		}
	}

	if _, err := os.Stat(FS_STORAGE_PATH + "/data"); os.IsNotExist(err) {
		if errMkdir := os.Mkdir(FS_STORAGE_PATH+"/data", 0755); errMkdir != nil {
			panic(errMkdir)
		}
	}

	// Read filesystem configuration file -> get disk's name
	var buf, err = os.ReadFile(FS_STORAGE_PATH + "/" + FS_CONF_FILE)
	if err != nil {
		panic(err.Error())
	}

	return &FsStorage{diskName: string(buf)}
}

func (fs *FsStorage) GetDiskName() string {
	return fs.diskName
}

func (fs *FsStorage) GetDiskSize() int {
	var stat unix.Statfs_t
	unix.Statfs(FS_STORAGE_PATH, &stat)

	return int(stat.Blocks * uint64(stat.Bsize) / 1024 / 1024)
}

func (fs *FsStorage) GetDiskLeftSpace() int {
	var stat unix.Statfs_t
	unix.Statfs(FS_STORAGE_PATH, &stat)

	return int(stat.Bavail * uint64(stat.Bsize) / 1024 / 1024)
}

func (fs *FsStorage) WriteFile(fileId string, data []byte) error {
	var err = os.WriteFile(FS_STORAGE_PATH+"/files/"+fileId, data, 0644)

	return err
}

func (fs *FsStorage) RemoveFile(fileId string) error {
	var err = os.Remove(FS_STORAGE_PATH + "/files/" + fileId)

	return err
}

func (fs *FsStorage) ReadFile(fileId string) (data []byte, size int64) {
	finfo, err := os.Stat(FS_STORAGE_PATH + "/files/" + fileId)
	if err != nil {
		panic(err)
	}

	var buf []byte
	buf, err = os.ReadFile(FS_STORAGE_PATH + "/files/" + fileId)
	if err != nil {
		panic(err)
	}

	return buf, finfo.Size()
}
