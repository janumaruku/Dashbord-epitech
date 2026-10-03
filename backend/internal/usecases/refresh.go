package usecases

import (
	"errors"
	"time"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/auth"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

var ErrInvalidRefreshToken = errors.New("invalid or expired refresh token")

type RefreshResult struct {
	Token        string
	RefreshToken string
}

// Refresh implements T010: validate a refresh token, issue a new access
// token, and rotate the refresh token. "Not found" and "expired" both
// return ErrInvalidRefreshToken, so callers can't tell which one it was.
func Refresh(db *gorm.DB, rawRefreshToken string) (*RefreshResult, error) {
	hash := auth.HashRefreshToken(rawRefreshToken)

	rt, err := models.FindRefreshTokenByHash(db, hash)
	if err != nil {
		if errors.Is(err, models.ErrRefreshTokenNotFound) {
			return nil, ErrInvalidRefreshToken
		}

		return nil, &DBError{Err: err}
	}

	if time.Now().After(rt.ExpiresAt) {
		_ = models.DeleteRefreshToken(db, rt.ID) // best-effort cleanup

		return nil, ErrInvalidRefreshToken
	}

	token, err := auth.GenerateToken(rt.UserID)
	if err != nil {
		return nil, &InternalError{Err: err}
	}

	// Create the replacement before deleting the old token: if creation
	// fails, the old token is still valid and the user isn't locked out.
	newRefreshToken, err := IssueRefreshToken(db, rt.UserID)
	if err != nil {
		return nil, err
	}

	if err := models.DeleteRefreshToken(db, rt.ID); err != nil {
		return nil, &DBError{Err: err}
	}

	return &RefreshResult{Token: token, RefreshToken: newRefreshToken}, nil
}
