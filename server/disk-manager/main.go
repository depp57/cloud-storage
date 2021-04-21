package main

import (
	. "github.com/sventhommet/cloud-storage/server/db"
)

//Port interfaces
var fsAdapt StoragePort
var sqlAdapt DbPort
var dnsAdapt DNSPort

func init() {
	fsAdapt = new(FsStoragePort)
	fsAdapt.init()

	sqlAdapt = new(SqlDbPort)
	sqlAdapt.Init()

	dnsAdapt = new(I_DNSPort)
	dnsAdapt.init()
}

func main() {
	defer sqlAdapt.Close()

	data, _ := fsAdapt.readFile("test")
	storeFile("sven", "docs/img/depp.jpg", data)
	//deleteFile("sven", "docs/img/depp.jpg")

	_ = dnsAdapt.addIpToDNS(fsAdapt.getDiskName())
}

func storeFile(userId string, fullpath string, data []byte) {
	var fileId = sqlAdapt.RegisterFile(userId, fullpath, fsAdapt.getDiskName())

	var err = fsAdapt.writeFile(fileId, data)

	//If file couldn't be wrote on the fs, we need to unregister it from db
	if err != nil {
		sqlAdapt.UnRegisterFile(userId, fullpath)
		panic(err.Error())
	}
}

func deleteFile(userId string, fullpath string) {
	var err = fsAdapt.removeFile(sqlAdapt.GetFileId(userId, fullpath))

	//Handle error if any, then unregister file from db
	if err != nil {
		panic(err.Error())
	}

	sqlAdapt.UnRegisterFile(userId, fullpath)
}
