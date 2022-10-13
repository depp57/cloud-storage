package fileMetadata

const (
	ASCII_END_OF_TRANSMISSION = 3
)

type FileMetadata struct {
	UploadID  string
	UserID    string
	Filename  string
	Path      string
	Size      int
	ChunkSize int
	CRC       string
}

type FileMetadataReceiver interface {
	GetFileMetadata() (FileMetadata, error)
}

type FileMetadataSender interface {
	SendFileMetadata(metadata FileMetadata) error
}
