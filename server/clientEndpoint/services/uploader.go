package services

// UploadNotifier must be implemented by IO layer to notify client about upload statuses
type UploadNotifier interface {
	PublishNewStatus(userId string, filePath string, status string) error
}
