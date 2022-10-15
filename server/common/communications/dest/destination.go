package dest

import (
	"errors"
	"strconv"
	"strings"
)

type Destination struct {
	Host string `json:"host"`
	Port int    `json:"port"`
}

func NewDestination(fullName string) (Destination, error) {
	split := strings.Split(fullName, ":")
	if len(split) != 2 {
		return Destination{}, errors.New("fullName must be of form '<host>:<port>'")
	}

	port, err := strconv.Atoi(split[1])
	if err != nil {
		return Destination{}, errors.New("port is not a number")
	}
	dest := Destination{
		Host: split[0],
		Port: port,
	}

	return dest, nil
}

func (d Destination) GetURL() string {
	return "http://" + d.GetHostAndPort()
}

func (d Destination) GetHostAndPort() string {
	return d.Host + ":" + strconv.Itoa(d.Port)
}

func (d Destination) GetHost() string {
	return d.Host
}

func (d Destination) GetPort() int {
	return d.Port
}