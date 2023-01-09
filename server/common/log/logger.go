package log

import (
	"fmt"
	"os"
)

func Debug(msg string) {
	fmt.Println("[Debug] " + msg)
}

func Info(msg string) {
	fmt.Println("[Info] " + msg)
}

func Warn(msg string) {
	fmt.Println("[Warn] " + msg)
}

func Error(msg string) {
	fmt.Println("[Error] " + msg)
}

func Fatal(msg string) {
	fmt.Println("[Fatal] " + msg)
	os.Exit(1)
}
