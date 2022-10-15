package main

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/database"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/services"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/storage"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/storage/filesystem"
	"io"
	"log"
	"net/http"
)

// Port interfaces
var (
	storing    storage.StoragePort
	db         database.Database
	fileBuffer services.FileBuffer
)

func init() {
	storing = filesystem.NewFsStorage()
	db = database.InitMysql()
}

func main() {
	metadataServer := gin.Default()

	metadataServer.POST("/files/metadata", handleNewMetadata)
	metadataServer.POST("/files/fragment", handleNewFragment)

	err := metadataServer.Run()
	if err != nil {
		log.Fatal("unable to start file metadata server: " + err.Error())
	}
}

func handleNewMetadata(ctx *gin.Context) {
	metadata := files.FileMetadata{}

	body, err := io.ReadAll(ctx.Request.Body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, err)
		return
	}

	err = json.Unmarshal(body, &metadata)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, err)
		return
	}

	err = fileBuffer.SaveMetadata(metadata)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, nil)
}

func handleNewFragment(ctx *gin.Context) {
	fragment := files.FileFragment{}

	body, err := io.ReadAll(ctx.Request.Body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, err)
		return
	}

	err = json.Unmarshal(body, &fragment)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, err)
		return
	}

	err = fileBuffer.SaveFragment(fragment)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, nil)
}
