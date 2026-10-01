package handlers

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/auth"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

const (
	msgInvalidRequestBody = "Invalid request body"
	msgInvalidUsername    = "Username must be 3-50 alphanumeric characters or underscores"
	msgInvalidEmail       = "Invalid email format"
	msgInvalidPassword    = "Password must contain at least 8 characters, including uppercase, lowercase, digit, and special character"
	msgUsernameTaken      = "Username already taken"
	msgEmailTaken         = "Email already registered"
	msgInvalidCredentials = "Invalid email or password"
)

func (app *App) issueTokensAndRespond(c *gin.Context, status int, user *models.User) {
	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		c.Error(&middleware.ServerError{Err: err})
		return
	}

	refreshToken, err := app.issueRefreshToken(user.ID)
	if err != nil {
		c.Error(&middleware.DBError{Err: err})
		return
	}

	c.JSON(status, gin.H{
		"token":         token,
		"refresh_token": refreshToken,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func (app *App) issueRefreshToken(userID string) (string, error) {
	raw, hash, err := auth.GenerateRefreshToken()
	if err != nil {
		return "", err
	}

	rt := models.RefreshToken{
		UserID:    userID,
		TokenHash: hash,
		ExpiresAt: time.Now().Add(auth.RefreshTokenTTL),
	}

	if err := models.CreateRefreshToken(app.DB, &rt); err != nil {
		return "", err
	}

	return raw, nil
}

func (app *App) Register(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(&middleware.DashbordError{Status: http.StatusBadRequest, Message: msgInvalidRequestBody})
		return
	}

	if !validUsername(req.Username) {
		c.Error(&middleware.DashbordError{Status: http.StatusBadRequest, Message: msgInvalidUsername})
		return
	}

	if !validEmail(req.Email) {
		c.Error(&middleware.DashbordError{Status: http.StatusBadRequest, Message: msgInvalidEmail})
		return
	}

	if !validPassword(req.Password) {
		c.Error(&middleware.DashbordError{Status: http.StatusBadRequest, Message: msgInvalidPassword})
		return
	}

	usernameTaken, err := models.UsernameExists(app.DB, req.Username)
	if err != nil {
		c.Error(&middleware.DBError{Err: err})
		return
	}
	if usernameTaken {
		c.Error(&middleware.DashbordError{Status: http.StatusConflict, Message: msgUsernameTaken})
		return
	}

	emailTaken, err := models.EmailExists(app.DB, req.Email)
	if err != nil {
		c.Error(&middleware.DBError{Err: err})
		return
	}
	if emailTaken {
		c.Error(&middleware.DashbordError{Status: http.StatusConflict, Message: msgEmailTaken})
		return
	}

	passwordHash, err := auth.HashPassword(req.Password)
	if err != nil {
		c.Error(&middleware.ServerError{Err: err})
		return
	}

	user := models.User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: passwordHash,
	}

	if err := models.CreateUser(app.DB, &user); err != nil {
		c.Error(&middleware.DBError{Err: err})
		return
	}

	app.issueTokensAndRespond(c, http.StatusCreated, &user)
}

func (app *App) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(&middleware.DashbordError{Status: http.StatusBadRequest, Message: msgInvalidRequestBody})
		return
	}

	user, err := models.FindUserByEmail(app.DB, req.Email)
	if err != nil {
		if errors.Is(err, models.ErrUserNotFound) {
			c.Error(&middleware.DashbordError{Status: http.StatusUnauthorized, Message: msgInvalidCredentials})
			return
		}

		c.Error(&middleware.DBError{Err: err})
		return
	}

	if err := auth.CheckPassword(req.Password, user.PasswordHash); err != nil {
		c.Error(&middleware.DashbordError{Status: http.StatusUnauthorized, Message: msgInvalidCredentials})
		return
	}

	app.issueTokensAndRespond(c, http.StatusOK, user)
}
