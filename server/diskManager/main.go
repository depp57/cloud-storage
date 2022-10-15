package main

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/api"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/database"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/disk/filesystem"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/httpClients"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/services"
	"log"
	"strconv"
	"time"
)

var API_PORT = 8009

var (
	storingTimeout = time.Minute * 5

	db           = database.InitMysql()
	diskStorage  = filesystem.NewFsStorage()
	diskRegister = services.NewDefaultDiskRegister(db, diskStorage)
	fileBuffer   = services.NewDefaultFileBuffer(storingTimeout)
	fragmentReceiver = api.NewFragmentHandler(API_PORT + 1, fileBuffer)
	CEclient     = httpClients.NewDefaultClientEndpointClient()
	storage      = services.NewDefaultStorage(fileBuffer, diskStorage, db, CEclient, storingTimeout)
	httpHandlers = api.NewHandlers(fileBuffer, storage)
)

func registerWorkingDisk() error {
	err := diskRegister.RegisterWorkingDisk(API_PORT)
	if err != nil {
		log.Fatal("unable to register diskManager into database: " + err.Error())
		return err
	}

	return nil
}

func main() {
	var err error

	err = registerWorkingDisk()
	if err != nil {
		return
	}

	fragmentReceiver.Start()

	gin.SetMode(gin.ReleaseMode)
	metadataServer := gin.Default()
	metadataServer.PUT("/files/metadata", httpHandlers.HandleNewFile)
	//metadataServer.GET("/files/status", httpHandlers.HandleUploadingStatus)

	err = metadataServer.Run("0.0.0.0:" + strconv.Itoa(API_PORT))
	if err != nil {
		log.Fatal("unable to start file metadata server: " + err.Error())
	}
}
