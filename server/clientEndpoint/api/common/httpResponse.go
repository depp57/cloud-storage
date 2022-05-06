package common

import (
	"encoding/json"
	"fmt"
)

func JsonResponse(doc map[string]interface{}) []byte {
	respJson, _ := json.Marshal(doc)
	return respJson
}

type genericError struct {
	Error string `json:"error"`
}

func GenericError(err string) []byte {
	errJson := genericError{Error: err}
	errStr, _ := json.Marshal(errJson)

	return []byte(errStr)
}

type httpMethodError struct {
	Error string `json:"error"`
}

func HttpMethodError(mustMethod string, actualMethod string) []byte {
	errJson := httpMethodError{Error: fmt.Sprintf("must be %s method, got %s", mustMethod, actualMethod)}
	errStr, _ := json.Marshal(errJson)

	return []byte(errStr)
}
