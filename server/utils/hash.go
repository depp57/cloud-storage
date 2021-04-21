package utils

import (
	system_sha256 "crypto/sha256"
	"encoding/hex"
)

func Sha256(clear string) (hashed string) {
	h := system_sha256.Sum256([]byte(clear))
	hashed = hex.EncodeToString(h[:])
	return
}
