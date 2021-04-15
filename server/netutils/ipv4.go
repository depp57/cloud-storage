package netutils

import (
	"errors"
	"math/rand"
	"net"
	"strconv"
	"strings"
	"time"
)

func isIPv4Addr(ip string) bool {
	var parts = strings.Split(ip, ".")
	for i := 0; i < 4; i++ {
		var part, err = strconv.Atoi(parts[i])
		if err != nil || part < 0 || part > 255 {
			return false
		}
	}
	return true
}

func GetMyIP(netInterface string) (string, error) {
	ifaces, _ := net.Interfaces()

	for _, iface := range ifaces {
		if iface.Name == netInterface {
			addrs, _ := iface.Addrs()

			for _, addr := range addrs {
				//Take off the subnet mask
				var ip_no_mask string = strings.Split(addr.String(), "/")[0]
				if isIPv4Addr(ip_no_mask) {
					return ip_no_mask, nil
				}
			}
			return "0", errors.New("no IPv4 for this interface")
		}
	}
	return "0", errors.New(netInterface + " interface not found")
}

//// MOVE ////

func init() {
	rand.Seed(time.Now().UnixNano())
}

var letterRunes = []rune("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func RandStringRunes(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
