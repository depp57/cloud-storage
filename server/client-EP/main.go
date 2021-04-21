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
	BindTo struct {
		Address string `yaml:"address"`
		Port    string `yaml:"port"`
	} `yaml:"bindTo"`
	Ssl struct {
		CertPath string `yaml:"certPath"`
		KeyPath  string `yaml:"keyPath"`
	} `yaml:"ssl"`
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
	defer sqlAdapt.Close()

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
	server.BindTo.Address = "0.0.0.0"
	server.BindTo.Port = "8008"
	server.Ssl.CertPath = "/etc/letsencrypt/archive/iofactory.fr/cert1.pem"
	server.Ssl.KeyPath = "/etc/letsencrypt/archive/iofactory.fr/privkey1.pem"

	router := http.NewServeMux()
	router.Handle("/", http.HandlerFunc(reqHandler))

	fmt.Println("--- Starting Client-EP component ---")

	if server.Ssl.CertPath != "" && server.Ssl.KeyPath != "" {
		fmt.Println("HTTPS secure server configured to listen on " + server.BindTo.Address + ":" + server.BindTo.Port + " ...")
		log.Fatal(http.ListenAndServeTLS(server.BindTo.Address+":"+server.BindTo.Port, server.Ssl.CertPath, server.Ssl.KeyPath, router))
	} else {
		fmt.Println("HTTP unsafe server configured to listen on " + server.BindTo.Address + ":" + server.BindTo.Port + " ...")
		log.Fatal(http.ListenAndServe(server.BindTo.Address+":"+server.BindTo.Port, router))
	}
}

func reqHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "OPTIONS" {
		//Handle CORS preflight here
		headers := w.Header()
		headers.Add("Access-Control-Allow-Origin", "*")
		headers.Add("Access-Control-Allow-Headers", "Content-Type, Origin, Accept, token")
		headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		headers.Add("Vary", "Origin")
		headers.Add("Vary", "Access-Control-Request-Method")
		headers.Add("Vary", "Access-Control-Request-Headers")
		return
	} else {
		//For any other requests use restAPI multiplexer
		restAPI := http.NewServeMux()
		restAPI.HandleFunc("/files/list/", handleFilesList)
		restAPI.HandleFunc("/files/dl/", handleFilesDL)
		restAPI.HandleFunc("/auth/", handleAuth)
		w.Header().Add("Content-Type", "application/json")
		w.Header().Add("Access-Control-Allow-Origin", "*")
		restAPI.ServeHTTP(w, r)
	}
}
