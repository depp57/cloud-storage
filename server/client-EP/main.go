package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/sventhommet/cloud-storage/server/db"
)

type Server struct {
	ADDRESS string
	PORT    int
}

var sqlAdapt db.DbPort

func init() {
	sqlAdapt = new(db.SqlDbPort)
}

func main() {
	var server Server
	server.ADDRESS = "0.0.0.0"
	server.PORT = 80

	http.HandleFunc("/files/list/", handleFilesList)
	http.HandleFunc("/files/dl/", handleFilesDL)

	log.Fatal(http.ListenAndServe(server.ADDRESS+":"+strconv.Itoa(server.PORT), nil))
}
