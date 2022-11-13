package api

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"io/ioutil"
	"net/http"
	"net/url"

	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/database"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services"
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	. "gitlab.com/sthommet/cloud-storage/server/common/xhttp"
)

const (
	FILE_TYPE_DIR  = "dir"
	FILE_TYPE_FILE = "file"
)

var (
	ErrInvalidJson = errors.New("input data: invalid json")
)

type HttpHandlers struct {
	auth      services.Auth
	filesSvc  services.Files
	uploadSvc services.Uploader
}

func InitHttpHandlers(auth services.Auth, filesSvc services.Files, uploader services.Uploader) *HttpHandlers {
	return &HttpHandlers{
		auth:      auth,
		filesSvc:  filesSvc,
		uploadSvc: uploader,
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
		WriteGenericError(response, connectionErr, http.StatusUnauthorized)
		return
	}

	WriteJsonReponse(response, map[string]interface{}{
		"token": token,
	})
}

func (h HttpHandlers) HandleDisconnect(response http.ResponseWriter, request *http.Request) {
	token := request.Header.Get(InternalHeaderAuth)

	h.auth.Revoke(token)

	response.WriteHeader(http.StatusCreated)
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
}

func (h HttpHandlers) HandleFilesList(resp http.ResponseWriter, req *http.Request) {
	filePathPercent := req.URL.Query().Get("filePath")
	userId := req.Header.Get(InternalHeaderAuth)

	filePath, err := url.QueryUnescape(filePathPercent) // filePath was sent by URL in percent encoding
	if err != nil {
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	files, err := h.filesSvc.List(userId, filePath)
	if err != nil {
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	WriteJsonReponse(resp, map[string]interface{}{
		"result": files,
	})
}

func (h HttpHandlers) HandleFileMove(resp http.ResponseWriter, req *http.Request) {
	userId := req.Header.Get(InternalHeaderAuth)

	input := UpdateFileInput{}
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&input)
	if err != nil {
		WriteGenericError(resp, ErrInvalidJson, http.StatusInternalServerError)
		return
	}

	err = h.filesSvc.Update(userId, input.Filepath, input.NewFilepath)
	switch err {
	case database.ErrQueryFailed: //TODO remove dependancy to database !!
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	resp.WriteHeader(201)
}

func (h HttpHandlers) HandleFileRename(resp http.ResponseWriter, req *http.Request) {
	userId := req.Header.Get(InternalHeaderAuth)

	input := UpdateFileInput{}
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&input)
	if err != nil {
		WriteGenericError(resp, ErrInvalidJson, http.StatusInternalServerError)
		return
	}

	err = h.filesSvc.Update(userId, input.Filepath, input.NewFilepath)
	switch err {
	case database.ErrQueryFailed: //TODO remove dependancy to database !!
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	resp.WriteHeader(201)
}

func (h HttpHandlers) HandleCreateDir(resp http.ResponseWriter, req *http.Request) {
	userId := req.Header.Get(InternalHeaderAuth)

	input := CreateFileInput{}
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&input)
	if err != nil {
		WriteGenericError(resp, ErrInvalidJson, http.StatusInternalServerError)
		return
	}

	err = h.filesSvc.CreateDir(userId, input.Name, input.Path)

	switch err {
	case database.ErrQueryFailed: //TODO remove dependancy to database !!
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}
}

func (h HttpHandlers) HandleUploadFile(resp http.ResponseWriter, req *http.Request) {
	userId := req.Header.Get(InternalHeaderAuth)

	input := CreateFileInput{}
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&input)
	if err != nil {
		WriteGenericError(resp, ErrInvalidJson, http.StatusInternalServerError)
		return
	}

	uploadID, chunckSize, err := h.uploadSvc.UploadRequest(userId, input.Path+"/"+input.Name, input.Size, input.CRC)

	if err != nil {
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	WriteJsonReponse(resp, map[string]interface{}{
		"uploadID":  uploadID,
		"chunkSize": chunckSize,
	})
}

func (h HttpHandlers) HandleUploadFragment(resp http.ResponseWriter, req *http.Request) {
	input := FileFragmentInput{}

	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&input)
	if err != nil {
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	decodeFragment, err := base64.StdEncoding.DecodeString(input.Fragment)
	if err != nil {
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	err = h.uploadSvc.UploadFileFragment(input.UploadID, decodeFragment)
	if err != nil {
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	resp.WriteHeader(201)
}

func (h HttpHandlers) HandleUploadStatus(resp http.ResponseWriter, req *http.Request) {
	userId := req.Header.Get(InternalHeaderAuth)
	input := UploadFileStatusInput{}

	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&input)
	if err != nil {
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	status, err := h.uploadSvc.GetCurrentStatus(userId, input.Filepath)
	if err != nil {
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	resp.WriteHeader(200)
	WriteJsonReponse(resp, map[string]interface{}{
		"status": status,
	})
}

func (h HttpHandlers) HandleFileUploadAcknowledge(resp http.ResponseWriter, req *http.Request) {
	metadata := files.FileMetadata{}

	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&metadata)
	if err != nil {
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	err = h.uploadSvc.AcknowledgeUploading(metadata)
	if err != nil {
		WriteGenericError(resp, err, http.StatusInternalServerError)
		return
	}

	resp.WriteHeader(200)
}
