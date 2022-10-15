package services

import (
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services/entities"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services/ports"
	"io"
	"strings"
)

type Files interface {
	List(userID string, filePath string) ([]entities.File, error)
	Download(userID string, filePath string) io.Reader
	Update(userID string, filePath string, newFilePath string) error
	CreateDir(userID string, dirName string, dirPath string) error
}

type defaultFiles struct {
	db ports.FileDbPort
}

func NewDefaultFiles(db ports.FileDbPort) Files {
	return &defaultFiles{db: db}
}

func (f *defaultFiles) List(userID string, filePath string) ([]entities.File, error) {
	path := strings.TrimPrefix(strings.TrimSuffix(filePath, "/"), "/") // both "workspace/java" and "/workspace/java/" must work

	dbFiles := f.db.GetFilesFromUser(userID, path)

	files := make([]entities.File, 0, len(dbFiles))
	for _, dbFile := range dbFiles {
		file := entities.File{
			Path: "/" + dbFile.Path, // for convenience reason, path are considered relative in db. They must be translated as absolute path when returned
			Type: dbFile.Type,
		}
		files = append(files, file)
	}

	return files, nil
}

func (f *defaultFiles) Download(userID string, filePath string) io.Reader {
	return nil
}

func (f *defaultFiles) Update(userID string, filePath string, newFilePath string) error {
	return f.db.UpdateFilePath(userID, filePath, newFilePath)
}

func (f *defaultFiles) CreateDir(userID string, dirName string, dirPath string) error {
	dirPath = strings.TrimPrefix(strings.TrimSuffix(dirPath, "/"), "/")

	return f.db.CreateDir(userID, dirName, dirPath)
}
