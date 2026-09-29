package config

import (
	"fmt"
	"log"
	"os"
)

func MySQLDSN() string {
	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?parseTime=true",
		MustGetenv("MYSQL_USER"),
		MustGetenv("MYSQL_PASSWORD"),
		MustGetenv("MYSQL_HOST"),
		MustGetenv("MYSQL_PORT"),
		MustGetenv("MYSQL_DATABASE"),
	)
}

func MustGetenv(key string) string {
	v := os.Getenv(key)

	if v == "" {
		log.Fatalf("missing required environment variable: %s", key)
	}

	return v
}
