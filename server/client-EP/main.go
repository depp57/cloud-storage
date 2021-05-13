package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	yaml "gopkg.in/yaml.v2"

	"github.com/sventhommet/cloud-storage/server/common/api"
	"github.com/sventhommet/cloud-storage/server/common/auth"
	database "github.com/sventhommet/cloud-storage/server/common/db"
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

var db database.DbPort
var authComp auth.Auth

func init() {
	db = database.InitSql()
	authComp = auth.Init(db)
}

func main() {
	defer db.Close()

	var SERVER_CONF_FILE = os.Getenv("SERVER_CONF_PATH")
	if SERVER_CONF_FILE == "" {
		panic("Please set SERVER_CONF_PATH env var")
	}

	var server Server
	var data, errYamlFile = os.ReadFile(SERVER_CONF_FILE)
	if errYamlFile != nil {
		panic("Could not read " + SERVER_CONF_FILE)
	}
	errYamlParse := yaml.Unmarshal([]byte(data), &server)
	if errYamlParse != nil {
		panic("Could not parse " + SERVER_CONF_FILE)
	}

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
	// delete trailing slash so '/auth/' and '/auth' are treated the same way
	r.URL.Path = strings.TrimSuffix(r.URL.Path, "/")

	if r.Method == api.OPTIONS {
		//Handle CORS preflight here
		headers := w.Header()
		headers.Add("Access-Control-Allow-Origin", "*")
		headers.Add("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, authorization")
		headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		headers.Add("Vary", "Origin")
		headers.Add("Vary", "Access-Control-Request-Method")
		headers.Add("Vary", "Access-Control-Request-Headers")
		return
	} else {
		//For any other requests use restAPI multiplexer
		restAPI := api.NewRestAPIMux(authComp)
		//First of all : add headers
		w.Header().Add("Content-Type", "application/json")
		w.Header().Add("Access-Control-Allow-Origin", "*")

		restAPI.DefaultRoute("/auth", "POST", handleAuth)
		restAPI.UserRoute("/auth/disconnect", "GET", handleDisconnect)
		restAPI.DefaultRoute("/subscribe", "POST", handleSubscribe)

		restAPI.UserRoute("/files/list", "POST", handleFilesList)
		restAPI.UserRoute("/files/dl", "GET", handleFilesDL)

		restAPI.ServeHTTP(w, r)
	}
}
