package services

import "errors"

var (
	ErrPathRegexMatch = errors.New("failed to parse and match path regex")
	ErrInvalidPath    = errors.New("the requested path is in an invalid format")
)
