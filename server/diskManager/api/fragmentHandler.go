package api

import (
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files/fileFragment"
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/services"
)

type fragmentHandler struct {
	receiver files.FileFragmentReceiver
	fileBuffer services.FileBuffer
}

func NewFragmentHandler(receiverPort int, fileBuffer services.FileBuffer) *fragmentHandler {
	tcpReceiver, err := fileFragment.NewTCPFileFragmentReceiver(receiverPort)
	if err != nil {
		log.Fatal("failed to initialize TCPFileFragmentReceiver: " + err.Error())
		panic(err) //TODO handle error
	}

	return &fragmentHandler{
		receiver: tcpReceiver,
		fileBuffer: fileBuffer,
	}
}

func (h *fragmentHandler) Start() {
	go func() {
		for {
			fragment, err := h.receiver.Get()
			if err != nil {
				log.Warn("failed to get fragment: " + err.Error())
				continue
			}

			err = h.fileBuffer.SaveFragment(fragment)
			if err != nil {
				log.Warn("failed to save fragment: " + err.Error())
			}
		}
	}()
}