package main

import (
	"net/http"
	_ "net/url"
)

func handleFilesList(response http.ResponseWriter, request *http.Request) {
	if request.Method != "GET" {
		response.WriteHeader(501)
		//TODO Content-type: json
		response.Write([]byte("{error: must be GET method}"))
		return
	}

	param := request.URL.Path[len("/files/find/"):]

	sqlAdapt.GetFilesFromUser("sven", "docs/depp")

	response.Write([]byte(param))

	return
}

func handleFilesDL(response http.ResponseWriter, request *http.Request) {
	if request.Method != "GET" {
		response.WriteHeader(501)
		response.Write([]byte("{error: must be GET method}"))
		return
	}

	param := request.URL.Path[len("/files/dl/"):]

	response.Write([]byte(param))

	return
}
