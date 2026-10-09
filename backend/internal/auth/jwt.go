package auth

import (
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"github.com/janumaruku/Dashbord-epitech/backend/config"
)

var ErrInvalidToken = errors.New("invalid or expired token")

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

func ParseToken(tokenString string) (string, error) {
	claims := &jwt.RegisteredClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}

		return []byte(config.MustGetenv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		return "", ErrInvalidToken
	}

	return claims.Subject, nil
}
