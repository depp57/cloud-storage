package database

import "time"

const TOKEN_SIZE = 20
const FILE_ID_LENGTH = 10

type File struct {
	Path   string
	Type   string
	DiskId string
}

type User struct {
	Id               string
	Name             string
	Token            string
	Token_expiration time.Time
	//password_hash string
}

type DbPort interface {
	FileDbPort
	AuthDbPort
	Close()
}

type FileDbPort interface {
	GetFilesFromUser(userId string, path string) map[string]File // Map index are files id

	WhereToSave(data []byte) (diskName string)
}

type AuthDbPort interface {
	UserExist(username string) bool
	//Returns a session token when user could be authentified, returns false otherwise
	ChallengeUserPassword(username string, password_hash string, token_expiration_t time.Time) (User, bool)
	ChallengeUserToken(token string) (User, bool)
	ReloadToken(token string, expiration time.Time) bool
	UnsetUserToken(token string) bool
}
