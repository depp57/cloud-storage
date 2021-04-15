package main

import (
	"log"
	"net/http"
	"strconv"

	. "github.com/sventhommet/cloud-storage/server/comports"
)

type Server struct {
	ADDRESS string
	PORT    int
}

var sqlAdapt DbPort

func init() {
	sqlAdapt = new(SqlDbPort)
}

func handleFilesFind(response http.ResponseWriter, request *http.Request) {
	if request.Method != "GET" {
		response.Write([]byte("{error: must be GET method}"))
		return
	}

	param := request.URL.Path[len("/files/find/"):]

	sqlAdapt.GetFilesFromUser("sven", "docs/")

	response.Write([]byte(param))

	return
}

func handleFilesDL(response http.ResponseWriter, request *http.Request) {
	if request.Method != "GET" {
		response.Write([]byte("{error: must be GET method}"))
		return
	}

	param := request.URL.Path[len("/files/dl/"):]

	response.Write([]byte(param))

	return
}

func main() {
	var server Server
	server.ADDRESS = "0.0.0.0"
	server.PORT = 80

	http.HandleFunc("/files/find/", handleFilesFind)
	http.HandleFunc("/files/dl/", handleFilesDL)

	log.Fatal(http.ListenAndServe(server.ADDRESS+":"+strconv.Itoa(server.PORT), nil))
}
