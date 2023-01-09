package services

import (
	"github.com/google/uuid"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services/entities"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services/ports"
	"io"
	"regexp"
)

type Files interface {
	List(userID string, path string) ([]entities.File, error)
	Download(userID string, filePath string) io.Reader
	Update(userID string, filePath string, newFilePath string) error
	CreateDir(userID string, dirName string, dirPath string) error
}

const (
	VALID_PATH = `^(/|(/[\w\d.-]+)*)$`
)

type defaultFiles struct {
	db ports.FileDbPort
}

func NewDefaultFiles(db ports.FileDbPort) Files {
	return &defaultFiles{db: db}
}

func (f *defaultFiles) List(userID string, path string) ([]entities.File, error) {
	err := f.pathError(path)
	if err != nil {
		return nil, err
	}

	dbFiles := f.db.GetFilesFromUser(userID, path)

	files := make([]entities.File, 0, len(dbFiles))
	for _, dbFile := range dbFiles {
		file := entities.File{
			Path: dbFile.Path,
			Type: dbFile.Type,
		}
		files = append(files, file)
	}

	return files, nil
}

func (f *defaultFiles) Update(userID string, filePath string, newFilePath string) error {
	err := f.pathError(newFilePath)
	if err != nil {
		return err
	}

	return f.db.UpdateFilePath(userID, filePath, newFilePath)
}

func (f *defaultFiles) CreateDir(userID string, dirName string, dirPath string) error {
	err := f.pathError(dirPath)
	if err != nil {
		return err
	}

	id := uuid.New().String()

	return f.db.CreateDir(userID, id, dirName, dirPath)
}

func (f *defaultFiles) Download(userID string, filePath string) io.Reader {
	return nil
}

func (f *defaultFiles) pathError(path string) error {
	isValid, err := regexp.Match(VALID_PATH, []byte(path))
	if err != nil {
		return ErrPathRegexMatch
	}
	if !isValid {
		return ErrInvalidPath
	}

	return nil
}
