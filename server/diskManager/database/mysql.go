package database

import (
	"database/sql"
	"os"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	"gopkg.in/yaml.v2"

	"github.com/sventhommet/cloud-storage/server/common/utils"
)

const MYSQL_CONF_FILE = "mysql.conf.yaml"

type SqlDbAdapter struct {
	db          *sql.DB
	DB_USER     string `yaml:"mysql_user"`
	DB_PASSWORD string `yaml:"mysql_password"`
	DB_IP       string `yaml:"mysql_server_ip"`
	DB_PORT     string `yaml:"mysql_server_port"`
	DB_NAME     string `yaml:"mysql_database_name"`
}

func InitMysql() *SqlDbAdapter {
	this := &SqlDbAdapter{}

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

	return this
}

func (this *SqlDbAdapter) Close() {
	this.db.Close()
}

func (this *SqlDbAdapter) GetFileId(userId string, fullpath string) string {
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
func (this *SqlDbAdapter) RegisterFile(userId string, fullpath string, diskName string) (fileId string) {
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

func (this *SqlDbAdapter) UnRegisterFile(userId string, fullpath string) error {
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

func (this *SqlDbAdapter) RegisterWorkingDisk(diskName string, ip string) {

}
