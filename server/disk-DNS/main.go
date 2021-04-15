package main

import (
	"fmt"
	"net"
	"strconv"
	"strings"
	"time"
)

//const MAX_ENTRIES = 10
const ANSWER_PORT = 31001
const DISK_PORT = 31002
const PROT_BUF_LEN = 85

var entries map[string]string = make(map[string]string)

func DiskMLoop() error {
	var server, err = net.Listen("tcp", "0.0.0.0:"+strconv.Itoa(DISK_PORT))
	if err != nil {
		return err
	}

	for {
		socket, err := server.Accept()
		if err != nil {

		}
		go answerDiskM(socket)
	}
}

func answerDiskM(socket net.Conn) {
	var buf = make([]byte, PROT_BUF_LEN)
	//Blocking function - wait for disk manager order
	size, _ := socket.Read(buf)
	var order = strings.Split(string(buf[:size+1]), " ")
	switch order[1] {
	case "ADD_DISK":
		var name = order[2]
		var ip = order[3]

		entries[name] = ip
		socket.Write([]byte(order[0] + " REPLY OK"))

		fmt.Println(entries)

		socket.Close()
		return
	}
}

func ClientEPLoop() error {
	var server, err = net.Listen("tcp", "0.0.0.0:"+strconv.Itoa(ANSWER_PORT))
	if err != nil {
		return err
	}

	for {
		socket, err := server.Accept()
		if err != nil {

		}
		go answerClient(socket)
	}
}

func answerClient(socket net.Conn) {
	var buf = make([]byte, PROT_BUF_LEN)
	//Blocking function - wait for client order
	size, _ := socket.Read(buf)
	var order = strings.Split(string(buf[:size+1]), " ")
	switch order[1] {
	case "GET_IP":
		var disk_name, ok = entries[order[2]]

		if !ok {
			socket.Write([]byte(order[0] + " REPLY NONE"))
		} else {
			socket.Write([]byte(order[0] + " REPLY " + entries[disk_name]))
		}

		socket.Close()
		return
	}
}

func main() {
	fmt.Println("Starting listening on port " + strconv.Itoa(DISK_PORT) + " for DiskManager...")
	go DiskMLoop()
	fmt.Println("Starting listening on port " + strconv.Itoa(ANSWER_PORT) + " for ClientEP...")
	go ClientEPLoop()
	time.Sleep(10 * 60 * time.Second)
}
