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
	if request.Method != "POST" {
		response.WriteHeader(http.StatusMethodNotAllowed)
		response.Write([]byte("{\"error\": \"must be POST method\"}"))
		return
	}

	var creds Creds
	result, err := ioutil.ReadAll(request.Body)
	if err != nil {
		panic(err)
	}
	err2 := json.Unmarshal(result, &creds)
	if err2 != nil {
		panic(err2)
	}

	fmt.Println("Trying to authenticate...")
	fmt.Println("user : " + creds.Username)
	fmt.Println("password : " + creds.Password)

	token, err := auth.Connect(creds.Username, creds.Password)
	if err != nil {
		response.WriteHeader(http.StatusUnauthorized)
		response.Write([]byte("{\"error\": \"" + err.Error() + "\"}"))
		return
	}

	response.Write([]byte("{\"token\": \"" + token + "\"}"))
	return
}

func handleDisconnect(response http.ResponseWriter, request *http.Request) {
	if request.Method != "GET" {
		response.WriteHeader(http.StatusMethodNotAllowed)
		response.Write([]byte("{\"error\": \"must be GET method\"}"))
		return
	}

	token := request.Header.Get("Authentified")

	auth.Revoke(token)

	response.WriteHeader(http.StatusCreated)
	return
}

func handleSubscribe(response http.ResponseWriter, request *http.Request) {

}

//  TODO...

// func handleFilesList(response http.ResponseWriter, request *http.Request) {
// 	if request.Method != "GET" {
// 		response.WriteHeader(http.StatusMethodNotAllowed)
// 		//TODO Content-type: json
// 		response.Write([]byte("{error: must be GET method}"))
// 		return
// 	}

// 	param := request.URL.Path[len("/files/find/"):]

// 	sqlAdapt.GetFilesFromUser("sven", "docs/depp")

// 	response.Write([]byte(param))

// 	return
// }

// func handleFilesDL(response http.ResponseWriter, request *http.Request) {
// 	if request.Method != "GET" {
// 		response.WriteHeader(http.StatusMethodNotAllowed)
// 		response.Write([]byte("{error: must be GET method}"))
// 		return
// 	}

// 	param := request.URL.Path[len("/files/dl/"):]

// 	response.Write([]byte(param))

// 	return
// }
