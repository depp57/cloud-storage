package database

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"

	"gopkg.in/yaml.v2"
)

type SqlDb struct {
	Client       *sql.DB
	Username     string `yaml:"mysql_user"`
	Password     string `yaml:"mysql_password"`
	ServerIP     string `yaml:"mysql_server_ip"`
	ServerPort   string `yaml:"mysql_server_port"`
	DatabaseName string `yaml:"mysql_database_name"`
}

func NewMysqlDb() SqlDb {
	db := SqlDb{}

	confPath := os.Getenv("MYSQL_CONF_PATH")
	if confPath == "" {
		log.Fatal("Please set MYSQL_CONF_PATH var")
	}

	var data, errYamlFile = os.ReadFile(confPath)
	if errYamlFile != nil {
		log.Fatal("Could not read mysql conf file " + confPath)
	}

	errYamlParse := yaml.Unmarshal(data, &db)
	if errYamlParse != nil {
		log.Fatal("Could not parse " + confPath)
	}

	db.Client, _ = sql.Open("mysql", db.Username+":"+db.Password+"@tcp("+db.ServerIP+":"+db.ServerPort+")/"+db.DatabaseName)
	if err := db.Client.Ping(); err != nil {
		log.Fatal(err.Error())
	}

	return db
}

func (s SqlDb) Close() {
	err := s.Client.Close()
	if err != nil {
		log.Fatal(err.Error())
	}
}
