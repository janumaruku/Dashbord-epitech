package config

import (
	"log"
	"os"
)

func MustGetenv(key string) string {
	v := os.Getenv(key)

	if v == "" {
		log.Fatalf("missing required environment variable: %s", key)
	}

	return v
}
