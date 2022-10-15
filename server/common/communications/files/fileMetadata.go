package files

// FileMetadata
// CRC must be IEEE implementation
type FileMetadata struct { //TODO package "entity" ?
	UploadID  string
	UserID    string
	Filename  string
	Path      string
	Size      int
	ChunkSize int
	CRC       uint32
}
