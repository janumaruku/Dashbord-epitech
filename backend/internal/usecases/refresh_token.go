package usecases

import (
	"time"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/auth"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

func IssueRefreshToken(db *gorm.DB, userID string) (string, error) {
	raw, hash, err := auth.GenerateRefreshToken()
	if err != nil {
		return "", err
	}

	rt := models.RefreshToken{
		UserID:    userID,
		TokenHash: hash,
		ExpiresAt: time.Now().Add(auth.RefreshTokenTTL),
	}

	if err := models.CreateRefreshToken(db, &rt); err != nil {
		return "", err
	}

	return raw, nil
}
