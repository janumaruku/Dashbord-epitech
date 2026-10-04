package usecases

import (
	"errors"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/auth"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

var ErrInvalidCredentials = errors.New("invalid credentials")

type LoginResult struct {
	User         *models.User
	Token        string
	RefreshToken string
}

// Login implements UC2: verify credentials, issue tokens. A wrong email
// and a wrong password both return ErrInvalidCredentials — the handler
// must never let the caller tell which one was wrong.
func Login(db *gorm.DB, email, password string) (*LoginResult, error) {
	user, err := models.FindUserByEmail(db, email)
	if err != nil {
		if errors.Is(err, models.ErrUserNotFound) {
			return nil, ErrInvalidCredentials
		}

		return nil, &DBError{Err: err}
	}

	if err := auth.CheckPassword(password, user.PasswordHash); err != nil {
		return nil, ErrInvalidCredentials
	}

	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		return nil, &InternalError{Err: err}
	}

	refreshToken, err := IssueRefreshToken(db, user.ID)
	if err != nil {
		return nil, err
	}

	return &LoginResult{User: user, Token: token, RefreshToken: refreshToken}, nil
}
