package fileTransfer

import "io"

func NewTcpReceiver() Receiver {
	return &defaultTcpReceiver{}
}

func (d defaultTcpReceiver) SetListeningPort(port int) {
	panic("implement me")
}

func (d defaultTcpReceiver) SetListeningRoute(route string) {
	panic("implement me")
}

func (d defaultTcpReceiver) WaitForFile(dest *io.ReadCloser) {
	panic("implement me")
}
