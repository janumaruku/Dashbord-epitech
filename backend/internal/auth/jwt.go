package auth

import (
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"github.com/janumaruku/Dashbord-epitech/backend/config"
)

func GenerateToken(userID string) (string, error) {
	expirySeconds, err := strconv.Atoi(config.MustGetenv("TOKEN_EXPIRY"))
	if err != nil {
		return "", err
	}

	claims := jwt.RegisteredClaims{
		Subject:   userID,
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(expirySeconds) * time.Second)),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(config.MustGetenv("JWT_SECRET")))
}
