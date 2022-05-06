package handlers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/url"

	. "github.com/sventhommet/cloud-storage/server/clientEndpoint/api/common"
	"github.com/sventhommet/cloud-storage/server/clientEndpoint/services"
	"github.com/sventhommet/cloud-storage/server/common/log"
)

type HttpHandlers struct {
	auth     services.Auth
	filesSvc services.Files
}

func InitHttpHandlers(auth services.Auth, filesSvc services.Files) *HttpHandlers {
	return &HttpHandlers{
		auth:     auth,
		filesSvc: filesSvc,
	}
}

func (h HttpHandlers) HandleAuth(response http.ResponseWriter, request *http.Request) {
	var creds Creds
	result, err := ioutil.ReadAll(request.Body)
	if err != nil {
		panic(err)
	}
	err = json.Unmarshal(result, &creds)
	if err != nil {
		panic(err)
	}

	log.Debug("trying to authenticate...")
	log.Debug("user : " + creds.Username)
	log.Debug("password : " + creds.Password)

	token, connectionErr := h.auth.Connect(creds.Username, creds.Password)
	if connectionErr != nil {
		response.WriteHeader(http.StatusUnauthorized)
		response.Write(GenericError(connectionErr.Error()))
		return
	}

	resp := make(map[string]interface{})
	resp["token"] = token
	response.Write(JsonResponse(resp))
	return
}

func (h HttpHandlers) HandleDisconnect(response http.ResponseWriter, request *http.Request) {
	token := request.Header.Get(InternalHeaderAuth)

	h.auth.Revoke(token)

	response.WriteHeader(http.StatusCreated)
	return
}

func (h HttpHandlers) HandleSubscribe(response http.ResponseWriter, request *http.Request) {
	var user Creds
	result, err := ioutil.ReadAll(request.Body)
	if err != nil {
		panic(err)
	}
	err = json.Unmarshal(result, &user)
	if err != nil {
		panic(err)
	}

	//db.RegisterUser(user.Username, user.Password)

	response.WriteHeader(http.StatusCreated)
	return
}

//  TODO
func (h HttpHandlers) HandleFilesList(resp http.ResponseWriter, req *http.Request) {
	filePathPercent := req.URL.Query().Get("filePath")
	userId := req.Header.Get(InternalHeaderAuth)

	filePath, err := url.QueryUnescape(filePathPercent) // filePath was sent by URL in percent encoding
	if err != nil {
		resp.Write(GenericError(err.Error()))
		return
	}

	files, err := h.filesSvc.List(userId, filePath)
	if err != nil {
		resp.Write(GenericError(err.Error()))
		return
	}

	response := make(map[string]interface{})
	response["result"] = files

	resp.Write(JsonResponse(response))

	return
}

//  TODO
func (h HttpHandlers) HandleFilesDL(response http.ResponseWriter, request *http.Request) {
	if request.Method != "GET" {
		response.WriteHeader(http.StatusMethodNotAllowed)
		response.Write([]byte("{error: must be GET method}"))
		return
	}

	param := request.URL.Path[len("/files/dl/"):]

	response.Write([]byte(param))

	return
}
