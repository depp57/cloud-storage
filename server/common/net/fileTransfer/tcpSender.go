package fileTransfer

import "io"

func NewTcpSender() Sender {
	return &defaultTcpSender{}
}

func (d defaultTcpSender) SetTarget(hostname string, port int) {
	panic("implement me")
}

func (d defaultTcpSender) SetRoute(route string) {
	panic("implement me")
}

func (d defaultTcpSender) SendFile(file *io.WriteCloser) {
	panic("implement me")
}
