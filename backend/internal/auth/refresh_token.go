package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
)

func GenerateRefreshToken() (raw string, hash string, err error) {
	buf := make([]byte, 32)

	if _, err := rand.Read(buf); err != nil {
		return "", "", err
	}

	raw = hex.EncodeToString(buf)

	return raw, HashRefreshToken(raw), nil
}

func HashRefreshToken(raw string) string {
	sum := sha256.Sum256([]byte(raw))

	return hex.EncodeToString(sum[:])
}
