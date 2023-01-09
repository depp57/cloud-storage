package api

import (
	"encoding/json"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/diskManager"
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/services"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type httpHandlers struct {
	fileBuffer services.FileBuffer
	StorageSvc services.Storage
}

func NewHandlers(fileBuffer services.FileBuffer, storageSvc services.Storage) *httpHandlers {
	return &httpHandlers{
		fileBuffer: fileBuffer,
		StorageSvc: storageSvc,
	}
}

func (h httpHandlers) HandleNewFile(ctx *gin.Context) {
	data := diskManager.NewFileInput{}

	body, err := io.ReadAll(ctx.Request.Body)
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	err = h.fileBuffer.SaveFileMetadata(data.Metadata)
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	err = h.StorageSvc.LaunchStoring(data.DiskManagerTarget, data.Metadata)
	if err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	ctx.JSON(http.StatusOK, nil)
}
