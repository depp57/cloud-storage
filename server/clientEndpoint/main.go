package main

import (
	"fmt"
	"log"
	"os"

	yaml "gopkg.in/yaml.v2"

	"github.com/sventhommet/cloud-storage/server/clientEndpoint/api"
	"github.com/sventhommet/cloud-storage/server/clientEndpoint/api/handlers"
	"github.com/sventhommet/cloud-storage/server/clientEndpoint/database"
	"github.com/sventhommet/cloud-storage/server/clientEndpoint/services"
	logger "github.com/sventhommet/cloud-storage/server/common/log"
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

var db database.DbPort
var auth services.Auth
var httpHandlers *handlers.HttpHandlers

func init() {
	db = database.NewMysqlDb()
	auth = services.InitAuth(db)
	//ffSender := fileFragment.NewTCPFileFragmentSender("", 0) //TODO fileBuffer connection
	filesSvc := services.NewDefaultFiles(db)
	httpHandlers = handlers.InitHttpHandlers(auth, filesSvc)
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
	router.DefaultRoute("/auth", api.POST, httpHandlers.HandleAuth)
	router.AuthentifiedRoute("/auth/disconnect", api.GET, httpHandlers.HandleDisconnect)

	router.AuthentifiedRoute("/files/list", api.GET, httpHandlers.HandleFilesList)
	router.AuthentifiedRoute("/files/move", api.POST, httpHandlers.HandleFileMove)
	router.AuthentifiedRoute("/files/rename", api.POST, httpHandlers.HandleFileRename)
	router.AuthentifiedRoute("/files/create", api.POST, httpHandlers.HandleFileCreate)
	//router.AuthentifiedRoute("/files/create/upload", api.POST, httpHandlers.HandleFilesUpload)
	//router.AuthentifiedRoute("/files/dl", api.GET, httpHandlers.HandleFilesDL)

	logger.Info("--- Starting Client-EP component ---")

	if conf.Ssl.CertPath != "" && conf.Ssl.KeyPath != "" {
		fmt.Println("HTTPS secure server configured to listen on " + conf.BindTo.Address + ":" + conf.BindTo.Port + " ...")
		router.ListenAndServeTLS(conf.BindTo.Address+":"+conf.BindTo.Port, conf.Ssl.CertPath, conf.Ssl.KeyPath)
	} else {
		fmt.Println("HTTP unsafe server configured to listen on " + conf.BindTo.Address + ":" + conf.BindTo.Port + " ...")
		log.Fatal(router.ListenAndServe(conf.BindTo.Address + ":" + conf.BindTo.Port))
	}
}
