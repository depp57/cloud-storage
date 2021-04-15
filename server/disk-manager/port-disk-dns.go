package main

import (
	"fmt"
	"net"
	"os"
	"strconv"

	"github.com/sventhommet/cloud-storage/server/netutils"
)

type DNSPort interface {
	init()
	addIpToDNS(diskName string) error
}

type I_DNSPort struct {
	diskManagerIP      string
	diskManagerIntName string

	diskDnsIP   string
	diskDnsPort int
}

func (this *I_DNSPort) init() {
	var err error

	this.diskManagerIntName = os.Getenv("NET_INTERFACE_NAME")
	if this.diskManagerIntName == "" {
		panic("Please set NET_INTERFACE_NAME env var before launching disk-manager service")
	}
	this.diskManagerIP, err = netutils.GetMyIP(this.diskManagerIntName)
	if err != nil {
		panic(err.Error())
	}

	this.diskDnsIP = os.Getenv("HTTP_DISK_DNS_SERVICE")
	if this.diskDnsIP == "" {
		panic("Please set HTTP_DISK_DNS_SERVICE env var before launching disk-manager service")
	}
	this.diskDnsPort = 31002
}

func (this *I_DNSPort) addIpToDNS(diskName string) error {
	var socket, err = net.Dial("tcp", this.diskDnsIP+":"+strconv.Itoa(this.diskDnsPort))
	if err != nil {
		return err
	}

	socket.Write([]byte("x ADD_DISK " + diskName + " " + this.diskManagerIP))
	var buf = make([]byte, 85)
	size, _ := socket.Read(buf)

	var reply = string(buf[:size+1])
	fmt.Println(reply)

	socket.Close()
	return nil
}
