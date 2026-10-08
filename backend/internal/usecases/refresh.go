package usecases

import (
	"errors"
	"net/http"
	"time"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/auth"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

var ErrInvalidRefreshToken = &dashborderrors.DashbordError{
	Code:    "INVALID_REFRESH_TOKEN",
	Message: "Invalid or expired refresh token",
	Status:  http.StatusUnauthorized,
}

type RefreshResult struct {
	Token        string
	RefreshToken string
}

func Refresh(db *gorm.DB, rawRefreshToken string) (*RefreshResult, error) {
	hash := auth.HashRefreshToken(rawRefreshToken)

	rt, err := models.FindRefreshTokenByHash(db, hash)
	if err != nil {
		if errors.Is(err, models.ErrRefreshTokenNotFound) {
			return nil, ErrInvalidRefreshToken
		}

		return nil, err
	}

	if time.Now().After(rt.ExpiresAt) {
		_ = models.DeleteRefreshToken(db, rt.ID)

		return nil, ErrInvalidRefreshToken
	}

	token, err := auth.GenerateToken(rt.UserID)
	if err != nil {
		return nil, err
	}

	newRefreshToken, err := IssueRefreshToken(db, rt.UserID)
	if err != nil {
		return nil, err
	}

	if err := models.DeleteRefreshToken(db, rt.ID); err != nil {
		return nil, err
	}

	return &RefreshResult{Token: token, RefreshToken: newRefreshToken}, nil
}
