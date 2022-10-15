package main

import (
	"fmt"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/httpClients"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services/ports"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files/fileFragment"
	"log"
	"net/http"
	"os"

	yaml "gopkg.in/yaml.v2"

	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/api"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/database"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services"
	logger "gitlab.com/sthommet/cloud-storage/server/common/log"
)

type ServerConf struct {
	BindTo struct {
		Address string `yaml:"address"`
		Port    string `yaml:"port"`
	} `yaml:"bindTo"`
	Ssl struct {
		CertPath string `yaml:"certPath"`
		KeyPath  string `yaml:"keyPath"`
	} `yaml:"ssl"`
}

var db ports.DbPort
var auth services.Auth
var httpHandlers *api.HttpHandlers

func init() {
	db = database.NewMysqlDb()
	auth = services.InitAuth(db)
	filesSvc := services.NewDefaultFiles(db)
	diskClient := httpClients.NewDefaultDiskManagerClient()
	fragmentSender := fileFragment.NewTCPFileFragmentSender()
	uploadSvc := services.NewDefaultUploader(db, diskClient, fragmentSender)
	httpHandlers = api.InitHttpHandlers(auth, filesSvc, uploadSvc)
}

func main() {
	defer db.Close()

	confPath := os.Getenv("SERVER_CONF_PATH")
	if confPath == "" {
		log.Fatal("Please set SERVER_CONF_PATH var")
	}

	var conf ServerConf
	var data, errYamlFile = os.ReadFile(confPath)
	if errYamlFile != nil {
		log.Fatal("Could not read server conf file " + confPath)
	}
	errYamlParse := yaml.Unmarshal([]byte(data), &conf)
	if errYamlParse != nil {
		panic("Could not parse " + confPath)
	}

	router := api.NewRestAPIRouters(auth)
	router.DefaultRoute("/auth", http.MethodPost, httpHandlers.HandleAuth)
	router.AuthentifiedRoute("/auth/disconnect", http.MethodGet, httpHandlers.HandleDisconnect)

	router.AuthentifiedRoute("/files/list", http.MethodGet, httpHandlers.HandleFilesList)
	router.AuthentifiedRoute("/files/move", http.MethodPost, httpHandlers.HandleFileMove)
	router.AuthentifiedRoute("/files/rename", http.MethodPost, httpHandlers.HandleFileRename)
	router.AuthentifiedRoute("/files/create", http.MethodPost, httpHandlers.HandleFileCreate)

	router.AuthentifiedRoute("/files/upload", http.MethodPost, httpHandlers.HandleFileCreate)
	router.AuthentifiedRoute("/files/upload/fragment", http.MethodPut, httpHandlers.HandleUploadFragment)
	router.AuthentifiedRoute("/files/upload/status", http.MethodGet, httpHandlers.HandleUploadStatus)

	router.DefaultRoute("/files/upload/acknowledge", http.MethodPost, httpHandlers.HandleFileUploadAcknowledge) //TODO rendre cette route "interne" pour que seul DiskManager ait accès

	//router.AuthentifiedRoute("/files/download", http.MethodGet, httpHandlers.HandleFilesDL)

	logger.Info("--- Starting Client-EP component ---")

	if conf.Ssl.CertPath != "" && conf.Ssl.KeyPath != "" {
		fmt.Println("HTTPS secure server configured to listen on " + conf.BindTo.Address + ":" + conf.BindTo.Port + " ...")
		router.ListenAndServeTLS(conf.BindTo.Address+":"+conf.BindTo.Port, conf.Ssl.CertPath, conf.Ssl.KeyPath)
	} else {
		fmt.Println("HTTP unsafe server configured to listen on " + conf.BindTo.Address + ":" + conf.BindTo.Port + " ...")
		log.Fatal(router.ListenAndServe(conf.BindTo.Address + ":" + conf.BindTo.Port))
	}
}
