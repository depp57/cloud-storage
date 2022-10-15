package api

type Creds struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type CreateFileInput struct {
	Type string `json:"fileType"`
	Name string `json:"fileName"`
	Path string `json:"filePath"`
	Size uint32 `json:"fileSize"`
	CRC  uint32 `json:"CRC"`
}

type UpdateFileInput struct {
	Filepath    string `json:"filePath"`
	NewFilepath string `json:"newFilePath"`
}

// FileFragmentInput
// Fragment must be base64 encoded
type FileFragmentInput struct {
	UploadID string `json:"uploadID"`
	Fragment string `json:"fragment"`
}

type UploadFileStatusInput struct {
	Filepath string `json:"filePath"`
}