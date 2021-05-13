package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Creds struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func handleAuth(response http.ResponseWriter, request *http.Request) {
	var creds Creds
	result, err := ioutil.ReadAll(request.Body)
	if err != nil {
		panic(err)
	}
	err = json.Unmarshal(result, &creds)
	if err != nil {
		panic(err)
	}

	fmt.Println("Trying to authenticate...")
	fmt.Println("user : " + creds.Username)
	fmt.Println("password : " + creds.Password)

	token, err := authComp.Connect(creds.Username, creds.Password)
	if err != nil {
		response.WriteHeader(http.StatusUnauthorized)
		response.Write([]byte("{\"error\": \"" + err.Error() + "\"}"))
		return
	}

	response.Write([]byte("{\"token\": \"" + token + "\"}"))
	return
}

func handleDisconnect(response http.ResponseWriter, request *http.Request) {
	token := request.Header.Get("Authentified")

	authComp.Revoke(token)

	response.WriteHeader(http.StatusCreated)
	return
}

func handleSubscribe(response http.ResponseWriter, request *http.Request) {
	var user Creds
	result, err := ioutil.ReadAll(request.Body)
	if err != nil {
		panic(err)
	}
	err = json.Unmarshal(result, &user)
	if err != nil {
		panic(err)
	}

	db.RegisterUser(user.Username, user.Password)

	response.WriteHeader(http.StatusCreated)
	return
}

//  TODO
func handleFilesList(response http.ResponseWriter, request *http.Request) {

	param := request.URL.Path[len("/files/find/"):]

	db.GetFilesFromUser("sven", "docs/depp")

	response.Write([]byte(param))

	return
}

//  TODO
func handleFilesDL(response http.ResponseWriter, request *http.Request) {
	if request.Method != "GET" {
		response.WriteHeader(http.StatusMethodNotAllowed)
		response.Write([]byte("{error: must be GET method}"))
		return
	}

	param := request.URL.Path[len("/files/dl/"):]

	response.Write([]byte(param))

	return
}
