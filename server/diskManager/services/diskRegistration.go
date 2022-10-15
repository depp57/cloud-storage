package services

import (
	"errors"
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/services/ports"
	"os"
	"strconv"
)

var (
	ErrAlreadyRegistered = errors.New("the disk was already registered")
)

type DiskRegistration interface {
	RegisterWorkingDisk(port int) error
}

type defaultRegister struct {
	db      ports.Database
	storage ports.DiskPort
}

func NewDefaultDiskRegister(db ports.Database, diskStorage ports.DiskPort) DiskRegistration {
	return &defaultRegister{
		db:      db,
		storage: diskStorage,
	}
}

func (d *defaultRegister) RegisterWorkingDisk(port int) error {
	ip, err := os.Hostname()
	if err != nil {
		return err //TODO wrap error
	}

	err = d.db.RegisterWorkingDisk(d.storage.GetDiskName(), ip+":"+strconv.Itoa(port), d.storage.GetDiskLeftSpace())
	if err == ErrAlreadyRegistered {
		log.Info(err.Error())
		return nil
	}
	if err != nil {
		return err //TODO wrap error
	}
	return nil
}
