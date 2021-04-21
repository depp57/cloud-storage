package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/sventhommet/cloud-storage/server/utils"
)

type AuthCouple struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func handleAuth(response http.ResponseWriter, request *http.Request) {
	if request.Method != "POST" {
		response.WriteHeader(405)
		response.Write([]byte("{\"error\": \"must be POST method\"}"))
		return
	}

	// request.ParseForm()
	// var username = request.PostFormValue("username")
	// var password = request.PostFormValue("password")

	var authC AuthCouple
	result, err := ioutil.ReadAll(request.Body)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
	err2 := json.Unmarshal(result, &authC)
	if err2 != nil {
		panic(err2)
	}

	fmt.Println("Trying to authenticate...")
	fmt.Println("user : " + authC.Username)
	fmt.Println("password : " + authC.Password)
	fmt.Println("password_sha256 : " + utils.Sha256(authC.Password) + "\n")

	token, err := auth.Connect(authC.Username, authC.Password)
	if err != nil {
		response.WriteHeader(401)
		response.Write([]byte("{\"error\": \"" + err.Error() + "\"}"))
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
