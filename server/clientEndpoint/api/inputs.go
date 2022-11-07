package api

type Creds struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type CreateFileInput struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Size uint32 `json:"size"`
	CRC  uint32 `json:"CRC"`
}

type UpdateFileInput struct {
	Filepath    string `json:"path"`
	NewFilepath string `json:"newPath"`
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
