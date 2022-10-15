package api

import (
	"encoding/base64"
	"encoding/json"
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
		response.WriteHeader(http.StatusUnauthorized)
		response.Write(GenericError(connectionErr.Error()))
		return
	}

	resp := make(map[string]interface{})
	resp["token"] = token
	response.Write(JsonResponse(resp))
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
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
		return
	}

	files, err := h.filesSvc.List(userId, filePath)
	if err != nil {
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
		return
	}

	response := make(map[string]interface{})
	response["result"] = files

	resp.Write(JsonResponse(response))
}

func (h HttpHandlers) HandleFileMove(resp http.ResponseWriter, req *http.Request) {
	userId := req.Header.Get(InternalHeaderAuth)

	input := UpdateFileInput{}
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&input)
	if err != nil {
		resp.Write(GenericError("input data: invalid json"))
		return
	}

	err = h.filesSvc.Update(userId, input.Filepath, input.NewFilepath)
	switch err {
	case database.ErrQueryFailed: //TODO remove dependancy to database !!
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
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
		resp.Write(GenericError("input data: invalid json"))
		resp.WriteHeader(500)
		return
	}

	err = h.filesSvc.Update(userId, input.Filepath, input.NewFilepath)
	switch err {
	case database.ErrQueryFailed: //TODO remove dependancy to database !!
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
		return
	}

	resp.WriteHeader(201)
}

func (h HttpHandlers) HandleFileCreate(resp http.ResponseWriter, req *http.Request) {
	userId := req.Header.Get(InternalHeaderAuth)

	input := CreateFileInput{}
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&input)
	if err != nil {
		resp.Write(GenericError("input data: invalid json"))
		resp.WriteHeader(500)
		return
	}

	switch input.Type {
	case FILE_TYPE_DIR:
		h.handleCreateDir(resp, input.Name, input.Path, userId)
		return
	case FILE_TYPE_FILE:
		h.handleCreateFile(resp, input, userId)
		return
	}

	resp.Write(GenericError("'" + input.Type + "' not accepted as a file type. Accepted values are 'dir', 'file'"))
}

func (h HttpHandlers) handleCreateDir(resp http.ResponseWriter, dirName string, dirPath string, userId string) {
	err := h.filesSvc.CreateDir(userId, dirName, dirPath)

	switch err {
	case database.ErrQueryFailed: //TODO remove dependancy to database !!
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
		return
	}
}

func (h HttpHandlers) handleCreateFile(resp http.ResponseWriter, input CreateFileInput, userId string) {
	uploadID, chunckSize, err := h.uploadSvc.UploadRequest(userId, input.Path+"/"+input.Name, input.Size, input.CRC)

	if err != nil {
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
		return
	}

	response := make(map[string]interface{}, 2)
	response["uploadID"] = uploadID
	response["chunkSize"] = chunckSize
	resp.Write(JsonResponse(response))
}

func (h HttpHandlers) HandleUploadFragment(resp http.ResponseWriter, req *http.Request) {
	input := FileFragmentInput{}

	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&input)
	if err != nil {
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
		return
	}

	decodeFragment, err := base64.StdEncoding.DecodeString(input.Fragment)
	if err != nil {
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
		return
	}

	err = h.uploadSvc.UploadFileFragment(input.UploadID, decodeFragment)
	if err != nil {
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
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
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
		return
	}

	status, err := h.uploadSvc.GetCurrentStatus(userId, input.Filepath)
	if err != nil {
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
		return
	}

	response := map[string]interface{}{"status": status}
	resp.WriteHeader(200)
	resp.Write(JsonResponse(response))
}

func (h HttpHandlers) HandleFileUploadAcknowledge(resp http.ResponseWriter, req *http.Request) {
	metadata := files.FileMetadata{}

	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&metadata)
	if err != nil {
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
		return
	}

	err = h.uploadSvc.AcknowledgeUploading(metadata)
	if err != nil {
		resp.Write(GenericError(err.Error()))
		resp.WriteHeader(500)
		return
	}

	resp.WriteHeader(200)
}
