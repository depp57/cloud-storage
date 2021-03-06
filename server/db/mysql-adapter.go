package db

import (
	"database/sql"
	"os"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"gopkg.in/yaml.v2"

	"github.com/sventhommet/cloud-storage/server/utils"
)

const MYSQL_CONF_FILE = "mysql.conf.yaml"

type SqlDbPort struct {
	db          *sql.DB
	DB_USER     string `yaml:"mysql_user"`
	DB_PASSWORD string `yaml:"mysql_password"`
	DB_IP       string `yaml:"mysql_server_ip"`
	DB_PORT     string `yaml:"mysql_server_port"`
	DB_NAME     string `yaml:"mysql_database_name"`
}

func (this *SqlDbPort) Init() {
	var data, errYamlFile = os.ReadFile(MYSQL_CONF_FILE)
	if errYamlFile != nil {
		panic("Could not read " + MYSQL_CONF_FILE)
	}
	errYamlParse := yaml.Unmarshal([]byte(data), this)
	if errYamlParse != nil {
		panic("Could not parse " + MYSQL_CONF_FILE)
	}

	this.db, _ = sql.Open("mysql", this.DB_USER+":"+this.DB_PASSWORD+"@tcp("+this.DB_IP+":"+this.DB_PORT+")/"+this.DB_NAME)
	if err := this.db.Ping(); err != nil {
		panic(err)
	}
}

func (this *SqlDbPort) Close() {
	this.db.Close()
}

func (this *SqlDbPort) GetFileId(userId string, fullpath string) string {
	//Separates file path and file name from fullpath
	var split = strings.Split(fullpath, "/")
	var fileName string = split[len(split)-1]
	var path string
	for i := 0; i < len(split)-1; i++ {
		if i == 0 {
			path += split[i]
		} else {
			path += "/" + split[i]
		}
	}

	var rows, err = this.db.Query("SELECT file_id FROM files WHERE user_id = '" + userId + "' AND file_name = '" + fileName + "' AND path = '" + path + "';")
	//If file not found, returns an empty string
	if err != nil {
		return ""
	}

	var fileId string
	rows.Next()
	rows.Scan(&fileId)
	return fileId
}

// DOES NOT verify if file already exists for user.
// Security : set a SQL index on rows (path, file_name, user_id)
func (this *SqlDbPort) RegisterFile(userId string, fullpath string, diskName string) (fileId string) {
	fileId = utils.RandString(FILE_ID_LENGTH)

	//Separates file path and file name from fullpath
	var split = strings.Split(fullpath, "/")
	var fileName string = split[len(split)-1]
	var path string
	for i := 0; i < len(split)-1; i++ {
		if i == 0 {
			path += split[i]
		} else {
			path += "/" + split[i]
		}
	}

	var _, err = this.db.Query("INSERT INTO files(file_id, file_name, path, user_id, disk_name) VALUES('" + fileId + "', '" + fileName + "', '" + path + "', '" + userId + "', '" + diskName + "');")

	//TODO remove panic and handle error
	if err != nil {
		panic(err.Error())
	}

	return fileId
}

func (this *SqlDbPort) UnRegisterFile(userId string, fullpath string) error {
	//Separates file path and file name from fullpath
	var split = strings.Split(fullpath, "/")
	var fileName string = split[len(split)-1]
	var path string
	for i := 0; i < len(split)-1; i++ {
		if i == 0 {
			path += split[i]
		} else {
			path += "/" + split[i]
		}
	}

	var _, err = this.db.Query("DELETE FROM files WHERE user_id = '" + userId + "' AND file_name = '" + fileName + "' AND path = '" + path + "';")

	//TODO remove panic and handle error
	if err != nil {
		panic(err.Error())
	}

	return err
}

func (this *SqlDbPort) GetFilesFromUser(userId string, path string) map[string]File {
	if path == "" {
		//TODO handle the case when ALL files from user are to be returned
	}

	//Remove ending '/' if any : both "worksapce/java" and "workspace/java/" must work
	if path[len(path)] == '/' {
		path = path[:len(path)-1]
	}

	var rows, err = this.db.Query("SELECT id, name, type, disk_name FROM files WHERE user_id = '" + userId + "' AND path = '" + path + "';")

	//TODO remove panic and implement : log errors
	if err != nil {
		panic(err.Error())
	}

	var results = make(map[string]File)
	var id string
	var name string
	var f_type string
	var disk_name string
	for rows.Next() {
		rows.Scan(&id, &name, &f_type, &disk_name)
		results[id] = File{name, f_type, disk_name}
	}

	return results
}

func (this *SqlDbPort) WhereToSave(data []byte) (diskName string) {
	return ""
}

func (this *SqlDbPort) UserExist(username string) bool {
	var rows, err = this.db.Query("SELECT username FROM users WHERE username='" + username + "';")
	//TODO remove panic and implement : log errors
	if err != nil {
		panic(err.Error())
	}

	return rows.Next()
}

func (this *SqlDbPort) ChallengeUserPassword(username string, password_hash string, token_expiration_t time.Time) (User, bool) {
	var rows, err = this.db.Query("SELECT id FROM users WHERE username='" + username + "' AND password_sha256 = '" + password_hash + "';")
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

	var _, err2 = this.db.Query("UPDATE users SET session_token='" + token + "', session_token_expiration='" + token_expiration + "' WHERE id='" + id + "';")
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

func (this *SqlDbPort) ChallengeUserToken(token string) (User, bool) {
	var rows, err = this.db.Query("SELECT id, username, session_token_expiration FROM users WHERE session_token='" + token + "' AND session_token_expiration > NOW();")
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
	// 	this.db.Query("UPDATE users SET session_token=NULL AND session_token_expiration=NULL WHERE id='" + id + "';")
	// 	return User{}, false
	// }

	return User{Id: id, Name: name, Token: token, Token_expiration: token_exp_t}, true
}

func (this *SqlDbPort) ReloadToken(token string, expiration time.Time) bool {
	return false
}

func (this *SqlDbPort) UnsetUserToken(token string) bool {
	return false
}
