package api

import (
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"

	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services"
)

type WebsocketHandler struct {
	auth      services.Auth
	filesSvc  services.Files
	uploadSvc services.Uploader

	socketTimeout time.Duration
}

type socket struct {
	start time.Time
	conn  *websocket.Conn
}

func InitWebsocketHandler(auth services.Auth, filesSvc services.Files, uploader services.Uploader, socketTimeout time.Duration) *WebsocketHandler {
	return &WebsocketHandler{
		auth:          auth,
		filesSvc:      filesSvc,
		uploadSvc:     uploader,
		socketTimeout: socketTimeout,
	}
}

func (h *WebsocketHandler) InitWebsocketFromHttpRequest(resp http.ResponseWriter, req *http.Request) {
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // we don't want to check Origin here, opinion : we don't rely on CORS
		},
	}

	conn, err := upgrader.Upgrade(resp, req, http.Header{})
	if err != nil {
		log.Error(err.Error()) // no need for handling http layer errors : upgrader.Upgrade() already does it
		return
	}
	conn.SetCloseHandler(func(code int, text string) error {
		log.Info("websocket closed")
		return nil
	})

	log.Info("websocket connected")

	ws := socket{
		conn:  conn,
		start: time.Now(),
	}

	go h.readSocket(ws)
	go h.handleSocketTimeout(ws)
}

func (h *WebsocketHandler) handleSocketTimeout(ws socket) {
	if time.Now().After(ws.start.Add(h.socketTimeout)) {
		log.Info("websocket server timeout")

		//h.uploadSvc.CancelUploadRequest(uploadID) TODO get uploadID from readSocket() *gasp*
		err := ws.conn.Close()
		if err != nil {
			//TODO handle async error
		}
		return
	}
}

func (h *WebsocketHandler) readSocket(ws socket) {
	_, uploadID, err := ws.conn.ReadMessage()
	if websocket.IsCloseError(err, websocket.CloseGoingAway) {
		return // socket was properly closed
	}
	if err != nil {
		log.Error("handleUploadFragment: failed to read message from websocket: " + err.Error())
		return
	}

	log.Info("Start reading websocket for uploadID : " + string(uploadID))

	for {
		_, data, err := ws.conn.ReadMessage()
		if websocket.IsCloseError(err, websocket.CloseGoingAway) {
			return // socket was properly closed
		}
		if err != nil {
			log.Error("handleUploadFragment: failed to read message from websocket: " + err.Error())
			return
		}

		err = h.uploadSvc.UploadFileFragment(string(uploadID), data)
		if err != nil {
			log.Error("handleUploadFragment: failed to upload file fragment: " + err.Error())
			continue
		}
	}
}
