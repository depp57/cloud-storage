package services

import (
	"io"
	"math"
	"strings"

	"github.com/google/uuid"
	"github.com/sventhommet/cloud-storage/server/clientEndpoint/database"
)

type Files interface {
	List(userID string, filePath string) ([]File, error)
	Download(userID string, filePath string) io.Reader
	Update(userID string, filePath string, newFilePath string) error
	CreateDir(userID string, dirName string, dirPath string) error
	CreateFile(userID string, fileName string, path string, fileSize int, CRC string) (string, int, error)
}

type defaultFiles struct {
	db                 database.FileDbPort
}

func NewDefaultFiles(db database.FileDbPort) Files {
	return &defaultFiles{db: db}
}

func (f *defaultFiles) List(userID string, filePath string) ([]File, error) {
	path := strings.TrimPrefix(strings.TrimSuffix(filePath, "/"), "/") // both "workspace/java" and "/workspace/java/" must work

	dbFiles := f.db.GetFilesFromUser(userID, path)

	files := make([]File, 0, len(dbFiles))
	for _, dbFile := range dbFiles {
		file := File{
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

func (f *defaultFiles) CreateFile(userID string, fileName string, path string, fileSize int, CRC string) (string, int, error) {
	path = strings.TrimPrefix(strings.TrimSuffix(path, "/"), "/")

	uploadId := uuid.New().String()
	chunkSize := f.computeChunkSize(fileSize)

	//err := f.fileMetadataSender.SendFileMetadata(fileBuffer.FileMetadata{
	//	UploadID:  uploadId,
	//	UserID:    userID,
	//	Filename:  fileName,
	//	Path:      path,
	//	Size:      fileSize,
	//	ChunkSize: chunkSize,
	//	CRC:       CRC,
	//})
	//if err != nil {
	//	log.Warn(err.Error())
	//	return "", 0, errors.New("failed to send file metadata to fileBuffer")
	//}

	return uploadId, chunkSize, nil
}

func (f *defaultFiles) computeChunkSize(fileSize int) int {
	return int(math.Floor(float64(fileSize) / 10.0)) //TODO
}

type File struct {
	Path   string `json:"filePath,omitempty"`
	Type   string `json:"type,omitempty"`
	UserID string `json:"userID,omitempty"`
	DiskId string `json:"diskId,omitempty"`
}
