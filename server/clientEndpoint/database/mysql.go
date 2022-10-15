package database

import (
	"errors"
	"fmt"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services/entities"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services/ports"
	commonDb "gitlab.com/sthommet/cloud-storage/server/common/database"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"gitlab.com/sthommet/cloud-storage/server/common/utils"
)

var (
	ErrQueryFailed = errors.New("failed to execute sql query") //TODO must be constant !!
)

type SqlDb struct {
	commonDb.SqlDb
}

func NewMysqlDb() *SqlDb {
	return &SqlDb{commonDb.NewMysqlDb()}
}

func (d *SqlDb) Close() {
	d.Close()
}

func (d *SqlDb) GetFilesFromUser(userId string, path string) map[string]entities.File {
	if path == "" {
		//TODO handle the case when ALL files from user are to be returned
	}

	var rows, err = d.Client.Query("SELECT id, type, file_name, disk_name FROM files WHERE user_id = '" + userId + "' AND path = '" + path + "';")
	defer rows.Close()

	if err != nil {
		log.Fatal(err.Error())
	}

	var results = make(map[string]entities.File)
	var id string
	var fileType string
	var fileName string
	var diskName string
	for rows.Next() {
		rows.Scan(&id, &fileType, &fileName, &diskName)
		if path != "" {
			path = path + "/" //TODO quick fix, do better
		}
		results[id] = entities.File{
			Path:   path + fileName,
			Type:   fileType,
			DiskID: diskName,
		}
	}

	return results
}

func (d *SqlDb) CreateDir(userId string, dirName string, dirPath string) error {
	id := uuid.New().String()

	_, err := d.Client.Query(fmt.Sprintf("INSERT INTO files (id, type, file_name, path, user_id) VALUES ('%s', '%s', '%s', '%s', '%s');", id, "dir", dirName, dirPath, userId))
	if err != nil {
		log.Warn(err.Error())
		return ErrQueryFailed
	}

	return nil
}

func (d *SqlDb) UpdateFilePath(userId string, path string, newPath string) error {
	newPath = filepath.Dir(newPath)
	newFilename := filepath.Base(newPath)
	oldPath := filepath.Dir(path)
	oldFilename := filepath.Base(path)

	_, err := d.Client.Query(fmt.Sprintf("UPDATE files SET file_name = '%s', path = '%s') WHERE user_id='%s' AND filename='%s' AND path='%s';", newFilename, newPath, userId, oldFilename, oldPath))
	if err != nil {
		log.Warn(err.Error())
		return ErrQueryFailed
	}

	return nil
}

func (d *SqlDb) GetAllDisks() ([]entities.DiskInfo, error) {
	var rows, err = d.Client.Query("SELECT disk_name, ip, space_left FROM disks ORDER BY space_left DESC;")
	if err != nil {
		return nil, err //TODO wrap error
	}

	disks := make([]entities.DiskInfo, 0)
	for rows.Next() {
		disk := entities.DiskInfo{}
		err := rows.Scan(&disk.DiskName, &disk.IP, &disk.SpaceLeft)
		if err != nil {
			return nil, err //TODO wrap error
		}
		disks = append(disks, disk)
	}

	return disks, nil
}

func (d *SqlDb) UserExist(username string) bool {
	var rows, err = d.Client.Query("SELECT username FROM users WHERE username='" + username + "';")
	//TODO remove panic and implement : log errors
	if err != nil {
		panic(err.Error())
	}

	return rows.Next()
}

func (d *SqlDb) ChallengeUserPassword(username string, password_hash string, token_expiration_t time.Time) (entities.User, bool) {
	var rows, err = d.Client.Query("SELECT id FROM users WHERE username='" + username + "' AND password_sha256 = '" + password_hash + "';")
	//TODO remove panic and implement : log errors
	if err != nil {
		panic(err.Error())
	}

	if !rows.Next() {
		return entities.User{}, false
	}
	var id string
	rows.Scan(&id)

	token := utils.RandString(ports.TOKEN_SIZE)
	token_expiration := strings.Split(token_expiration_t.String(), ".")[0]

	var _, err2 = d.Client.Query("UPDATE users SET session_token='" + token + "', session_token_expiration='" + token_expiration + "' WHERE id='" + id + "';")
	//TODO remove panic and implement : log errors
	if err2 != nil {
		panic(err.Error())
	}

	return entities.User{
		Id:               id,
		Name:             username,
		Token:            token,
		Token_expiration: token_expiration_t,
	}, true
}

func (d *SqlDb) ChallengeUserToken(token string) (entities.User, bool) {
	var rows, err = d.Client.Query("SELECT id, username, session_token_expiration FROM users WHERE session_token='" + token + "' AND session_token_expiration > NOW();")
	//TODO remove panic and implement : log errors
	if err != nil {
		panic(err.Error())
	}

	if !rows.Next() {
		return entities.User{}, false
	}

	var id string
	var name string
	var token_expiration string
	rows.Scan(&id, &name, &token_expiration)

	token_exp_t, _ := time.Parse("", token_expiration)

	// if token_exp_t.Before(time.Now()) {
	// 	d.Client.Query("UPDATE users SET session_token=NULL AND session_token_expiration=NULL WHERE id='" + id + "';")
	// 	return User{}, false
	// }

	return entities.User{Id: id, Name: name, Token: token, Token_expiration: token_exp_t}, true
}

func (d *SqlDb) ReloadToken(token string, expiration time.Time) bool {
	return false
}

func (d *SqlDb) UnsetUserToken(token string) bool {
	return false
}
