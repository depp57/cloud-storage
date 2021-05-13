package main

import "github.com/sventhommet/cloud-storage/server/common/db"

//Port interfaces
var fsAdapt StoragePort
var Db db.DbPort
var dnsAdapt DNSPort

func init() {
	fsAdapt = new(FsStoragePort)
	fsAdapt.init()

	Db = db.InitSql()

	dnsAdapt = new(I_DNSPort)
	dnsAdapt.init()
}

func main() {
	defer Db.Close()

	data, _ := fsAdapt.readFile("test")
	storeFile("sven", "docs/img/depp.jpg", data)
	//deleteFile("sven", "docs/img/depp.jpg")

	_ = dnsAdapt.addIpToDNS(fsAdapt.getDiskName())
}

func mkdir(userId string, fullpath string) {

}

func storeFile(userId string, fullpath string, data []byte) {
	var fileId = Db.RegisterFile(userId, fullpath, fsAdapt.getDiskName())

	var err = fsAdapt.writeFile(fileId, data)

	//If file couldn't be wrote on the fs, we need to unregister it from db
	if err != nil {
		Db.UnRegisterFile(userId, fullpath)
		panic(err.Error())
	}

	//TODO disk table in db : diskLeftSpace() ?
}

func deleteFile(userId string, fullpath string) {
	var err = fsAdapt.removeFile(Db.GetFileId(userId, fullpath))

	//Handle error if any, then unregister file from db
	if err != nil {
		panic(err.Error())
	}

	Db.UnRegisterFile(userId, fullpath)

	//TODO disk table in db : diskLeftSpace() ?
}
