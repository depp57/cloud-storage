package files

// FileMetadata
// CRC must be IEEE implementation
type FileMetadata struct { //TODO package "entity" ?
	UploadID  string `json:"uploadID"`
	UserID    string `json:"userID"`
	Filename  string `json:"filename"`
	Path      string `json:"path"`
	Size      uint32 `json:"size"`
	ChunkSize uint   `json:"chunkSize"`
	CRC       uint32 `json:"CRC"`
}
