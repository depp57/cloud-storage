package main

import (
	"os"

	"golang.org/x/sys/unix"
)

const FS_STORAGE_PATH = "/var/lib/cloud-storage"
const FS_CONF_FILE = "disk-info.conf"

type StoragePort interface {
	init()

	getDiskName() string
	getDiskSize() int
	getDiskLeftSpace() int

	writeFile(fileId string, data []byte) error
	removeFile(fileId string) error
	readFile(fileId string) (data []byte, size int64)
}

//*** Filesystem implementation of storage port ***

type FsStoragePort struct {
	diskName string
}

// Init makes sure that the storage directory exists on filesystem
func (fs *FsStoragePort) init() {
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

	fs.diskName = string(buf)
}

func (fs *FsStoragePort) getDiskName() string {
	return fs.diskName
}

func (*FsStoragePort) getDiskSize() int {
	var stat unix.Statfs_t
	unix.Statfs(FS_STORAGE_PATH, &stat)

	return int(stat.Blocks * uint64(stat.Bsize) / 1024 / 1024)
}

func (*FsStoragePort) getDiskLeftSpace() int {
	var stat unix.Statfs_t
	unix.Statfs(FS_STORAGE_PATH, &stat)

	return int(stat.Bavail * uint64(stat.Bsize) / 1024 / 1024)
}

func (*FsStoragePort) writeFile(fileId string, data []byte) error {
	var err = os.WriteFile(FS_STORAGE_PATH+"/files/"+fileId, data, 0644)

	return err
}

func (*FsStoragePort) removeFile(fileId string) error {
	var err = os.Remove(FS_STORAGE_PATH + "/files/" + fileId)

	return err
}

func (*FsStoragePort) readFile(fileId string) (data []byte, size int64) {
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
