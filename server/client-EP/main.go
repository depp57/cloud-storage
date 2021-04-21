package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/sventhommet/cloud-storage/server/db"
	yaml "gopkg.in/yaml.v2"
)

type Server struct {
	bindTo struct {
		address string
		port    string
	}
	ssl struct {
		certPath string
		keyPath  string
	}
}

var sqlAdapt db.DbPort
var auth Auth

func init() {
	sqlAdapt = new(db.SqlDbPort)
	sqlAdapt.Init()
	auth = new(AuthStruct)
	auth.Init(sqlAdapt)
}

func main() {
	var server Server
	var data, errYamlFile = os.ReadFile("server.yaml")
	if errYamlFile != nil {
		panic("Could not read server.yaml")
	}
	errYamlParse := yaml.Unmarshal([]byte(data), &server)
	if errYamlParse != nil {
		panic("Could not parse server.yaml")
	}
	//TODO make it work
	server.bindTo.address = "0.0.0.0"
	server.bindTo.port = "8008"
	//server.ssl.certPath = "/etc/letsencrypt/archive/iofactory.fr/cert1.pem"
	//server.ssl.keyPath = "/etc/letsencrypt/archive/iofactory.fr/privkey1.pem"

	// http.HandleFunc("/files/list/", handleFilesList)
	// http.HandleFunc("/files/dl/", handleFilesDL)
	// http.HandleFunc("/auth/", handleAuth)

	corsMux := http.NewServeMux()
	corsMux.Handle("/", http.HandlerFunc(corsHandler))

	fmt.Println("--- Starting Client-EP component ---")

	if server.ssl.certPath != "" && server.ssl.keyPath != "" {
		fmt.Println("HTTPS secure server configured to listen on " + server.bindTo.address + ":" + server.bindTo.port + " ...")
		log.Fatal(http.ListenAndServeTLS(server.bindTo.address+":"+server.bindTo.port, server.ssl.certPath, server.ssl.keyPath, nil))
	} else {
		fmt.Println("HTTP unsafe server configured to listen on " + server.bindTo.address + ":" + server.bindTo.port + " ...")
		log.Fatal(http.ListenAndServe(server.bindTo.address+":"+server.bindTo.port, corsMux))
	}
}

func corsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "OPTIONS" {
		//handle preflight in here
		headers := w.Header()
		headers.Add("Access-Control-Allow-Origin", "*")
		headers.Add("Vary", "Origin")
		headers.Add("Vary", "Access-Control-Request-Method")
		headers.Add("Vary", "Access-Control-Request-Headers")
		headers.Add("Access-Control-Allow-Headers", "Content-Type, Origin, Accept, token")
		headers.Add("Access-Control-Allow-Methods", "GET, POST,OPTIONS")
		return
	} else {
		restAPI := http.NewServeMux()
		restAPI.HandleFunc("/files/list/", handleFilesList)
		restAPI.HandleFunc("/files/dl/", handleFilesDL)
		restAPI.HandleFunc("/auth/", handleAuth)
		restAPI.ServeHTTP(w, r)
	}
}
