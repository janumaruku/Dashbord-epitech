package usecases

import (
	"net/http"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/auth"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

var ErrInvalidUsername = &dashborderrors.DashbordError{
	Code:    "INVALID_USERNAME",
	Message: "Username must be 3-50 alphanumeric characters or underscores",
	Status:  http.StatusBadRequest,
}

var ErrInvalidEmail = &dashborderrors.DashbordError{
	Code:    "INVALID_EMAIL",
	Message: "Invalid email format",
	Status:  http.StatusBadRequest,
}

var ErrInvalidPassword = &dashborderrors.DashbordError{
	Code:    "INVALID_PASSWORD",
	Message: "Password must contain at least 8 characters, including uppercase, lowercase, digit, and special character",
	Status:  http.StatusBadRequest,
}

var ErrUsernameTaken = &dashborderrors.DashbordError{
	Code:    "USERNAME_TAKEN",
	Message: "Username already taken",
	Status:  http.StatusConflict,
}

var ErrEmailTaken = &dashborderrors.DashbordError{
	Code:    "EMAIL_TAKEN",
	Message: "Email already registered",
	Status:  http.StatusConflict,
}

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
		return nil, err
	}
	if usernameTaken {
		return nil, ErrUsernameTaken
	}

	emailTaken, err := models.EmailExists(db, email)
	if err != nil {
		return nil, err
	}
	if emailTaken {
		return nil, ErrEmailTaken
	}

	passwordHash, err := auth.HashPassword(password)
	if err != nil {
		return nil, err
	}

	user := models.User{
		Username:     username,
		Email:        email,
		PasswordHash: passwordHash,
	}

	if err := models.CreateUser(db, &user); err != nil {
		return nil, err
	}

	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	refreshToken, err := IssueRefreshToken(db, user.ID)
	if err != nil {
		return nil, err
	}

	return &RegisterResult{User: &user, Token: token, RefreshToken: refreshToken}, nil
}
