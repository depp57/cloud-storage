package comports

import (
	"database/sql"
	"strings"

	_ "github.com/go-sql-driver/mysql"

	"github.com/sventhommet/cloud-storage/server/netutils"
)

const DB_USER = "cloud-storage"
const DB_PASSWORD = "root"
const DB_IP = "192.168.0.200"
const DB_PORT = "3306"
const DB_NAME = "cloud_storage"

type fileDb struct {
	name     string
	f_type   string
	diskName string
}

type DbPort interface {
	Init()

	//*** Used by disk-manager ***//

	GetFileId(userId string, fullpath string) string

	//Register a file into database (doesn't mean that the file has been stored on the disk)
	//Must verify that the file isn't already existing
	RegisterFile(userId string, fullpath string, diskName string) (fileId string)

	UnRegisterFile(userId string, fullpath string) error

	//*** Used by client-EP ***//

	GetFilesFromUser(userId string, path string) map[string]fileDb

	// What's the best disk to store file regarding space left
	WhereToSave(data []byte) (diskName string)
}

//*** MySQL implementation of db port ***

type SqlDbPort struct {
	db *sql.DB
}

func (this *SqlDbPort) Init() {
	this.db, _ = sql.Open("mysql", DB_USER+":"+DB_PASSWORD+"@tcp("+DB_IP+":"+DB_PORT+")/"+DB_NAME)
	if err := this.db.Ping(); err != nil {
		panic(err)
	}
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
	fileId = netutils.RandStringRunes(10)

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

func (this *SqlDbPort) GetFilesFromUser(userId string, path string) map[string]fileDb {
	if path == "" {
		//TODO handle the case when ALL files from user are to be returned
	}

	var rows, err = this.db.Query("SELECT id, name, type, disk_name FROM files WHERE user_id = '" + userId + "' AND path = '" + path + "';")

	//TODO remove panic and handle error
	if err != nil {
		panic(err.Error())
	}

	var results = make(map[string]fileDb)
	var id string
	var name string
	var f_type string
	var disk_name string
	for rows.Next() {
		rows.Scan(&id, &name, &f_type, &disk_name)
		results[id] = fileDb{name, f_type, disk_name}
	}

	return results
}

func (this *SqlDbPort) WhereToSave(data []byte) (diskName string) {
	return ""
}
