package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/sventhommet/cloud-storage/server/utils"
)

type authCouple struct {
	username string
	password string
}

func handleAuth(response http.ResponseWriter, request *http.Request) {
	if request.Method != "POST" {
		response.WriteHeader(405)
		response.Write([]byte("{error: must be POST method}"))
		return
	}

	// request.ParseForm()
	// var username = request.PostFormValue("username")
	// var password = request.PostFormValue("password")

	var authC authCouple
	result, err := ioutil.ReadAll(request.Body)
	json.Unmarshal(result, &authC)

	fmt.Println("Trying to authenticate...")
	fmt.Println("user : " + authC.username)
	fmt.Println("password : " + authC.password)
	fmt.Println("password_sha256 : " + utils.Sha256(authC.password) + "\n")

	token, err := auth.Connect(authC.username, authC.password)
	if err != nil {
		response.WriteHeader(401)
		response.Write([]byte("{error: " + err.Error() + "}"))
		return
	}

	response.Write([]byte("{token: " + token + "}"))
	return
}

func handleFilesList(response http.ResponseWriter, request *http.Request) {
	if request.Method != "GET" {
		response.WriteHeader(405)
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
