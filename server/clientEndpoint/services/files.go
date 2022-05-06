package services

import (
	"io"
	"strings"

	"github.com/sventhommet/cloud-storage/server/clientEndpoint/database"
)

type Files interface {
	List(userId string, filePath string) ([]File, error)
	Download(userId string, filePath string) io.Reader
	Update(userId string, filePath string, newFilePath string) error
}

type defaultFiles struct {
	db database.FileDbPort
}

func NewDefaultFiles(db database.FileDbPort) Files {
	return &defaultFiles{db: db}
}

func (f *defaultFiles) List(userId string, filePath string) ([]File, error) {
	path := strings.TrimPrefix(strings.TrimSuffix(filePath, "/"), "/") // both "workspace/java" and "/workspace/java/" must work

	dbFiles := f.db.GetFilesFromUser(userId, path)

	files := make([]File, 0, len(dbFiles))
	for _, dbFile := range dbFiles {
		file := File{
			Path: "/" + strings.dbFile.Path, // for convenience reason, path are considered relative in db. They must be translated as absolute path when returned
			Type: dbFile.Type,
		}
		files = append(files, file)
	}

	return files, nil
}

func (f *defaultFiles) Download(userId string, filePath string) io.Reader {
	return nil
}

func (f *defaultFiles) Update(userId string, filePath string, newFilePath string) error {
	return nil
}

func (f *defaultFiles) UploadRequest(userId string, filePath string, size int, fileCheckSum string) (chunckSize int) {
	return 0
}

type File struct {
	Path   string `json:"filePath,omitempty"`
	Type   string `json:"type,omitempty"`
	UserId string `json:"userId,omitempty"`
	DiskId string `json:"diskId,omitempty"`
}
