package common

type Creds struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type CreateFileInput struct {
	Type string `json:"fileType"`
	Name string `json:"fileName"`
	Path string `json:"filePath"`
	Size int    `json:"fileSize"`
	CRC  string `json:"CRC"`
}

type UpdateFileInput struct {
	Filepath    string `json:"filePath"`
	NewFilepath string `json:"newFilePath"`
}
