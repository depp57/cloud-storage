package services

/*
func storeFile(file partialFile) error {
	var fileId = db.RegisterFile(userId, fullpath, fsAdapt.getDiskName())

	var err = storing.WriteFile(fileId, data)

	//If file couldn't be wrote on the fs, we need to unregister it from db
	if err != nil {
		db.UnRegisterFile(userId, fullpath)
		panic(err.Error())
	}

	//TODO disk table in db : diskLeftSpace() ?
}

func deleteFile(userId string, fullpath string) error {
	var err = fsAdapt.removeFile(db.GetFileId(userId, fullpath))

	//Handle error if any, then unregister file from db
	if err != nil {
		panic(err.Error())
	}

	db.UnRegisterFile(userId, fullpath)

	//TODO disk table in db : diskLeftSpace() ?
}
*/