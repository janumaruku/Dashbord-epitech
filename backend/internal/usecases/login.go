package usecases

import (
	"errors"
	"net/http"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/auth"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

var ErrInvalidCredentials = &dashborderrors.DashboardError{
	Code:    "INVALID_CREDENTIALS",
	Message: "Invalid email or password",
	Status:  http.StatusUnauthorized,
}

type LoginResult struct {
	User         *models.User
	Token        string
	RefreshToken string
}

func Login(db *gorm.DB, email, password string) (*LoginResult, error) {
	user, err := models.FindUserByEmail(db, email)
	if err != nil {
		if errors.Is(err, models.ErrUserNotFound) {
			return nil, ErrInvalidCredentials
		}

		return nil, err
	}

	if err := auth.CheckPassword(password, user.PasswordHash); err != nil {
		return nil, ErrInvalidCredentials
	}

	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	refreshToken, err := IssueRefreshToken(db, user.ID)
	if err != nil {
		return nil, err
	}

	return &LoginResult{User: user, Token: token, RefreshToken: refreshToken}, nil
}
