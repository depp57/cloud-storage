package database

import (
	"errors"
	"github.com/go-sql-driver/mysql"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/services"
	"strconv"
	"strings"

	commonDb "gitlab.com/sthommet/cloud-storage/server/common/database"
)

type SqlDbAdapter struct {
	commonDb.SqlDb
}

func InitMysql() *SqlDbAdapter {
	return &SqlDbAdapter{commonDb.NewMysqlDb()}
}

func (s *SqlDbAdapter) Close() {
	s.Close()
}

func (s *SqlDbAdapter) GetFileId(userId string, fullpath string) string {
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

	var rows, err = s.Client.Query("SELECT file_id FROM files WHERE user_id = '" + userId + "' AND file_name = '" + fileName + "' AND path = '" + path + "';")
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
func (s *SqlDbAdapter) RegisterFile(userId string, fullpath string, diskName string, uploadID string) error {
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

	var _, err = s.Client.Query("INSERT INTO files(id, type, file_name, path, user_id, disk_name) VALUES('" + uploadID + "', 'file', '" + fileName + "', '" + path + "', '" + userId + "', '" + diskName + "');")

	//TODO remove panic and handle error
	if err != nil {
		panic(err.Error())
	}

	return nil
}

func (s *SqlDbAdapter) UnRegisterFile(userId string, fullpath string) error {
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

	var _, err = s.Client.Query("DELETE FROM files WHERE user_id = '" + userId + "' AND file_name = '" + fileName + "' AND path = '" + path + "';")

	//TODO remove panic and handle error
	if err != nil {
		panic(err.Error())
	}

	return err
}

func (s *SqlDbAdapter) RegisterWorkingDisk(diskName string, ip string, spaceLeft uint32) error {
	var _, err = s.Client.Query("INSERT INTO disks(disk_name, ip, space_left) VALUES ('" + diskName + "','" + ip + "','" + strconv.Itoa(int(spaceLeft)) + "');")

	var errSQL = &mysql.MySQLError{}
	if errors.As(err, &errSQL) && errSQL.Number == 1062 {
		return services.ErrAlreadyRegistered
	}
	if err != nil {
		return err //TODO wrap error
	}

	return nil
}
