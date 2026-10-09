package auth

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"errors"

	"github.com/janumaruku/Dashbord-epitech/backend/config"
)

var ErrCiphertextTooShort = errors.New("ciphertext too short")

func encryptionKey() []byte {
	sum := sha256.Sum256([]byte(config.MustGetenv("JWT_SECRET")))
	return sum[:]
}

func Encrypt(plaintext []byte) ([]byte, error) {
	block, err := aes.NewCipher(encryptionKey())
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := rand.Read(nonce); err != nil {
		return nil, err
	}

	return gcm.Seal(nonce, nonce, plaintext, nil), nil
}

func Decrypt(ciphertext []byte) ([]byte, error) {
	block, err := aes.NewCipher(encryptionKey())
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonceSize := gcm.NonceSize()
	if len(ciphertext) < nonceSize {
		return nil, ErrCiphertextTooShort
	}

	nonce, data := ciphertext[:nonceSize], ciphertext[nonceSize:]

	return gcm.Open(nil, nonce, data, nil)
}
