package db

import "time"

const TOKEN_SIZE = 20
const FILE_ID_LENGTH = 10

type File struct {
	name     string
	f_type   string
	diskName string
}

type User struct {
	Id               string
	Name             string
	Token            string
	Token_expiration time.Time
	//password_hash string
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

	GetFilesFromUser(userId string, path string) map[string]File

	// What's the best disk to store file regarding space left
	WhereToSave(data []byte) (diskName string)

	//*** Used by Auth component ***//

	UserExist(username string) bool
	//Returns a session token when user could be authentified, returns false otherwise
	ChallengeUserPassword(username string, password_hash string, token_expiration_t time.Time) (User, bool)
	ChallengeUserToken(token string) (User, bool)
	ReloadToken(token string, expiration time.Time) bool
	UnsetUserToken(token string) bool
}
