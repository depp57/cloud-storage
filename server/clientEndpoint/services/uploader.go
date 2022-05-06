package services

type Artifacts interface {
	Accept(userId string, filePath string, data []byte) error
}

// UploadNotifier must be implemented by IO layer to notify client about upload statuses
type UploadNotifier interface {
	PublishNewStatus(userId string, filePath string, status string) error
}

type UploadRequester interface {
	// UploadRequest
	// return chunkSize that has been computed server-side and is used to determine how many chunks are waited
	NewUploadRequest(userId string, filePath string, fileSize int, fileCheckSum string) (chunckSize int)
}
