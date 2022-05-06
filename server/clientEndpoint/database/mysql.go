package database

import (
	"database/sql"
	"os"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"gopkg.in/yaml.v2"

	"github.com/sventhommet/cloud-storage/server/common/log"
	"github.com/sventhommet/cloud-storage/server/common/utils"
)

type SqlDb struct {
	client       *sql.DB
	Username     string `yaml:"mysql_user"`
	Password     string `yaml:"mysql_password"`
	ServerIP     string `yaml:"mysql_server_ip"`
	ServerPort   string `yaml:"mysql_server_port"`
	DatabaseName string `yaml:"mysql_database_name"`
}

func NewMysqlDb() *SqlDb {
	db := &SqlDb{}

	confPath := os.Getenv("MYSQL_CONF_PATH")
	if confPath == "" {
		log.Fatal("Please set MYSQL_CONF_PATH var")
	}

	var data, errYamlFile = os.ReadFile(confPath)
	if errYamlFile != nil {
		log.Fatal("Could not read mysql conf file " + confPath)
	}

	errYamlParse := yaml.Unmarshal(data, db)
	if errYamlParse != nil {
		log.Fatal("Could not parse " + confPath)
	}

	db.client, _ = sql.Open("mysql", db.Username+":"+db.Password+"@tcp("+db.ServerIP+":"+db.ServerPort+")/"+db.DatabaseName)
	if err := db.client.Ping(); err != nil {
		log.Fatal(err.Error())
	}

	return db
}

func (this *SqlDb) Close() {
	err := this.client.Close()
	if err != nil {
		log.Fatal(err.Error())
	}
}

func (this *SqlDb) GetFilesFromUser(userId string, path string) map[string]File {
	if path == "" {
		//TODO handle the case when ALL files from user are to be returned
	}

	var rows, err = this.client.Query("SELECT id, type, file_name, disk_name FROM files WHERE user_id = '" + userId + "' AND path = '" + path + "';")
	defer rows.Close()

	if err != nil {
		log.Fatal(err.Error())
	}

	var results = make(map[string]File)
	var id string
	var fileType string
	var fileName string
	var diskName string
	for rows.Next() {
		rows.Scan(&id, &fileType, &fileName, &diskName)
		results[id] = File{path + "/" + fileName, fileType, diskName}
	}

	return results
}

func (this *SqlDb) WhereToSave(data []byte) (diskName string) {
	return ""
}

func (this *SqlDb) UserExist(username string) bool {
	var rows, err = this.client.Query("SELECT username FROM users WHERE username='" + username + "';")
	//TODO remove panic and implement : log errors
	if err != nil {
		panic(err.Error())
	}

	return rows.Next()
}

func (this *SqlDb) ChallengeUserPassword(username string, password_hash string, token_expiration_t time.Time) (User, bool) {
	var rows, err = this.client.Query("SELECT id FROM users WHERE username='" + username + "' AND password_sha256 = '" + password_hash + "';")
	//TODO remove panic and implement : log errors
	if err != nil {
		panic(err.Error())
	}

	if !rows.Next() {
		return User{}, false
	}
	var id string
	rows.Scan(&id)

	token := utils.RandString(TOKEN_SIZE)
	token_expiration := strings.Split(token_expiration_t.String(), ".")[0]

	var _, err2 = this.client.Query("UPDATE users SET session_token='" + token + "', session_token_expiration='" + token_expiration + "' WHERE id='" + id + "';")
	//TODO remove panic and implement : log errors
	if err2 != nil {
		panic(err.Error())
	}

	return User{
		Id:               id,
		Name:             username,
		Token:            token,
		Token_expiration: token_expiration_t,
	}, true
}

func (this *SqlDb) ChallengeUserToken(token string) (User, bool) {
	var rows, err = this.client.Query("SELECT id, username, session_token_expiration FROM users WHERE session_token='" + token + "' AND session_token_expiration > NOW();")
	//TODO remove panic and implement : log errors
	if err != nil {
		panic(err.Error())
	}

	if !rows.Next() {
		return User{}, false
	}

	var id string
	var name string
	var token_expiration string
	rows.Scan(&id, &name, &token_expiration)

	token_exp_t, _ := time.Parse("", token_expiration)

	// if token_exp_t.Before(time.Now()) {
	// 	this.client.Query("UPDATE users SET session_token=NULL AND session_token_expiration=NULL WHERE id='" + id + "';")
	// 	return User{}, false
	// }

	return User{Id: id, Name: name, Token: token, Token_expiration: token_exp_t}, true
}

func (this *SqlDb) ReloadToken(token string, expiration time.Time) bool {
	return false
}

func (this *SqlDb) UnsetUserToken(token string) bool {
	return false
}
