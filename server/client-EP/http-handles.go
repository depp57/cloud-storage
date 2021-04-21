package main

import (
	"fmt"
	"net/http"

	"github.com/sventhommet/cloud-storage/server/utils"
)

func handleAuth(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("Content-Type", "application/json")
	response.Header().Add("Access-Control-Allow-Origin", "*")

	if request.Method != "POST" {
		response.WriteHeader(501)
		response.Write([]byte("{error: must be POST method}"))
		return
	}

	request.ParseForm()
	var username = request.PostFormValue("username")
	var password = request.PostFormValue("password")

	fmt.Println("Trying to authenticate...")
	fmt.Println("user : " + username)
	fmt.Println("password : " + password)
	fmt.Println("password_sha256 : " + utils.Sha256(password) + "\n")

	token, err := auth.Connect(username, password)
	if err != nil {
		response.WriteHeader(501)
		response.Write([]byte("{error: " + err.Error() + "}"))
		return
	}

	response.Write([]byte("{token: " + token + "}"))
	return
}

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

// func addAngularHeaders(response *http.ResponseWriter) {
// 	response.Add("Content-Type", "application/json")
// 	response.Add("Access-Control-Allow-Origin", "*")
// }
