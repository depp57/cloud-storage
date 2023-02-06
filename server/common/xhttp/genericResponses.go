package xhttp

import (
	"encoding/json"
	"fmt"
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"net/http"
)

func WriteJsonReponse(writer http.ResponseWriter, response map[string]interface{}) {
	respJson, _ := json.Marshal(response)
	writer.Header().Set("content-type", "application/json")
	writer.Write(respJson)
}

func WriteGenericError(writer http.ResponseWriter, err error, statusCode int) {
	log.Error("http generic error: " + err.Error())

	errResp, _ := json.Marshal(map[string]string{
		"error": err.Error(),
	})

	writer.Header().Set("content-type", "application/json")
	writer.WriteHeader(statusCode)
	writer.Write(errResp)
}

type httpMethodError struct {
	Error string `json:"error"`
}

func HttpMethodError(mustMethod string, actualMethod string) []byte {
	errJson := httpMethodError{Error: fmt.Sprintf("must be %s method, got %s", mustMethod, actualMethod)}
	errStr, _ := json.Marshal(errJson)

	return []byte(errStr)
}
