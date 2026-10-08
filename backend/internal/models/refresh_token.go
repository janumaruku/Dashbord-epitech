package models

import (
	"errors"
	"net/http"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
)

var ErrRefreshTokenNotFound = &dashborderrors.DashboardError{
	Code:    "REFRESH_TOKEN_NOT_FOUND",
	Message: "Refresh token not found",
	Status:  http.StatusNotFound,
}

type RefreshToken struct {
	ID        string `gorm:"type:char(36);primaryKey"`
	UserID    string `gorm:"type:char(36);not null"`
	TokenHash string `gorm:"size:64;unique;not null"`
	ExpiresAt time.Time
	CreatedAt time.Time
}

func (r *RefreshToken) BeforeCreate(tx *gorm.DB) error {
	if r.ID == "" {
		r.ID = uuid.New().String()
	}

	return nil
}

func CreateRefreshToken(db *gorm.DB, rt *RefreshToken) error {
	return db.Create(rt).Error
}

func FindRefreshTokenByHash(db *gorm.DB, hash string) (*RefreshToken, error) {
	var rt RefreshToken

	if err := db.Where("token_hash = ?", hash).First(&rt).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrRefreshTokenNotFound
		}

		return nil, err
	}

	return &rt, nil
}

func DeleteRefreshToken(db *gorm.DB, id string) error {
	return db.Delete(&RefreshToken{}, "id = ?", id).Error
}
