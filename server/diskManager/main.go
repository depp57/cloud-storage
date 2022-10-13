package main

import (
	"github.com/sventhommet/cloud-storage/server/diskManager/database"
	"github.com/sventhommet/cloud-storage/server/diskManager/storage"
	"github.com/sventhommet/cloud-storage/server/diskManager/storage/filesystem"
)

//Port interfaces
var storing storage.StoragePort
var db database.Database

func init() {
	storing = filesystem.NewFsStorage()
	db = database.InitMysql()
}

func main() {
	defer db.Close()

	data, _ := fsAdapt.readFile("test")
	storeFile("sven", "docs/img/depp.jpg", data)
	//deleteFile("sven", "docs/img/depp.jpg")

	_ = dnsAdapt.addIpToDNS(fsAdapt.getDiskName())
}

func mkdir(userId string, fullpath string) {

}

func storeFile(userId string, fullpath string, data []byte) {
	var fileId = db.RegisterFile(userId, fullpath, fsAdapt.getDiskName())

	var err = storing.WriteFile(fileId, data)

	//If file couldn't be wrote on the fs, we need to unregister it from db
	if err != nil {
		db.UnRegisterFile(userId, fullpath)
		panic(err.Error())
	}

	//TODO disk table in db : diskLeftSpace() ?
}

func deleteFile(userId string, fullpath string) {
	var err = fsAdapt.removeFile(db.GetFileId(userId, fullpath))

	//Handle error if any, then unregister file from db
	if err != nil {
		panic(err.Error())
	}

	db.UnRegisterFile(userId, fullpath)

	//TODO disk table in db : diskLeftSpace() ?
}
