package usecases

import (
	"errors"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/auth"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

var (
	ErrInvalidUsername = errors.New("invalid username")
	ErrInvalidEmail    = errors.New("invalid email")
	ErrInvalidPassword = errors.New("invalid password")
	ErrUsernameTaken   = errors.New("username already taken")
	ErrEmailTaken      = errors.New("email already registered")
)

type RegisterResult struct {
	User         *models.User
	Token        string
	RefreshToken string
}

func Register(db *gorm.DB, username, email, password string) (*RegisterResult, error) {
	if !validUsername(username) {
		return nil, ErrInvalidUsername
	}

	if !validEmail(email) {
		return nil, ErrInvalidEmail
	}

	if !validPassword(password) {
		return nil, ErrInvalidPassword
	}

	usernameTaken, err := models.UsernameExists(db, username)
	if err != nil {
		return nil, &DBError{Err: err}
	}
	if usernameTaken {
		return nil, ErrUsernameTaken
	}

	emailTaken, err := models.EmailExists(db, email)
	if err != nil {
		return nil, &DBError{Err: err}
	}
	if emailTaken {
		return nil, ErrEmailTaken
	}

	passwordHash, err := auth.HashPassword(password)
	if err != nil {
		return nil, &InternalError{Err: err}
	}

	user := models.User{
		Username:     username,
		Email:        email,
		PasswordHash: passwordHash,
	}

	if err := models.CreateUser(db, &user); err != nil {
		return nil, &DBError{Err: err}
	}

	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		return nil, &InternalError{Err: err}
	}

	refreshToken, err := IssueRefreshToken(db, user.ID)
	if err != nil {
		return nil, err
	}

	return &RegisterResult{User: &user, Token: token, RefreshToken: refreshToken}, nil
}
