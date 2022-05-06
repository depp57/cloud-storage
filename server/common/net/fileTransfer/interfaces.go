package fileTransfer

import "io"

type Receiver interface {
	SetListeningPort(port int)
	SetListeningRoute(route string)
	WaitForFile(dest *io.ReadCloser)
}

type Sender interface {
	SetTarget(hostname string, port int)
	SetRoute(route string)
	SendFile(file *io.WriteCloser)
}

type defaultTcpReceiver struct {
	listeningPort int
	route         string
}

type defaultTcpSender struct {
	targetHostname string
	targetPort     string
	route          string
}
