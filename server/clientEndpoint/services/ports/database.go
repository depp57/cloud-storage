package ports

import (
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services/entities"
	"time"
)

const TOKEN_SIZE = 20
const FILE_ID_LENGTH = 10

type DbPort interface {
	FileDbPort
	AuthDbPort
	Close()
}

type FileDbPort interface {
	GetFilesFromUser(userId string, path string) map[string]entities.File // Map index are files id
	CreateDir(userId, dirName, dirPath string) error
	UpdateFilePath(userId string, path string, newPath string) error

	GetAllDisks() ([]entities.DiskInfo, error)
}

type AuthDbPort interface {
	UserExist(username string) bool
	//Returns a session token when user could be authentified, returns false otherwise
	ChallengeUserPassword(username string, password_hash string, token_expiration_t time.Time) (entities.User, bool)
	ChallengeUserToken(token string) (entities.User, bool)
	ReloadToken(token string, expiration time.Time) bool
	UnsetUserToken(token string) bool
}
