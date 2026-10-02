package handlers

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/auth"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/usecases"
)

const (
	msgInvalidRequestBody  = "Invalid request body"
	msgInvalidUsername     = "Username must be 3-50 alphanumeric characters or underscores"
	msgInvalidEmail        = "Invalid email format"
	msgInvalidPassword     = "Password must contain at least 8 characters, including uppercase, lowercase, digit, and special character"
	msgUsernameTaken       = "Username already taken"
	msgEmailTaken          = "Email already registered"
	msgInvalidCredentials  = "Invalid email or password"
	msgInvalidRefreshToken = "Invalid or expired refresh token"
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

	c.JSON(status, NewAuthPresenter(token, refreshToken, user))
}

func (app *App) issueRefreshToken(userID string) (string, error) {
	return usecases.IssueRefreshToken(app.DB, userID)
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

	result, err := usecases.Register(app.DB, req.Username, req.Email, req.Password)
	if err != nil {
		switch {
		case errors.Is(err, usecases.ErrInvalidUsername):
			c.Error(&middleware.DashbordError{Status: http.StatusBadRequest, Message: msgInvalidUsername})
		case errors.Is(err, usecases.ErrInvalidEmail):
			c.Error(&middleware.DashbordError{Status: http.StatusBadRequest, Message: msgInvalidEmail})
		case errors.Is(err, usecases.ErrInvalidPassword):
			c.Error(&middleware.DashbordError{Status: http.StatusBadRequest, Message: msgInvalidPassword})
		case errors.Is(err, usecases.ErrUsernameTaken):
			c.Error(&middleware.DashbordError{Status: http.StatusConflict, Message: msgUsernameTaken})
		case errors.Is(err, usecases.ErrEmailTaken):
			c.Error(&middleware.DashbordError{Status: http.StatusConflict, Message: msgEmailTaken})
		default:
			var dbErr *usecases.DBError
			if errors.As(err, &dbErr) {
				c.Error(&middleware.DBError{Err: dbErr.Err})
			} else {
				c.Error(&middleware.ServerError{Err: err})
			}
		}
		return
	}

	c.JSON(http.StatusCreated, NewAuthPresenter(result.Token, result.RefreshToken, result.User))
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

type refreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}

func (app *App) Refresh(c *gin.Context) {
	var req refreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(&middleware.DashbordError{Status: http.StatusBadRequest, Message: msgInvalidRequestBody})
		return
	}

	hash := auth.HashRefreshToken(req.RefreshToken)

	rt, err := models.FindRefreshTokenByHash(app.DB, hash)
	if err != nil {
		if errors.Is(err, models.ErrRefreshTokenNotFound) {
			c.Error(&middleware.DashbordError{Status: http.StatusUnauthorized, Message: msgInvalidRefreshToken})
			return
		}

		c.Error(&middleware.DBError{Err: err})
		return
	}

	if time.Now().After(rt.ExpiresAt) {
		_ = models.DeleteRefreshToken(app.DB, rt.ID) // best-effort cleanup

		c.Error(&middleware.DashbordError{Status: http.StatusUnauthorized, Message: msgInvalidRefreshToken})
		return
	}

	token, err := auth.GenerateToken(rt.UserID)
	if err != nil {
		c.Error(&middleware.ServerError{Err: err})
		return
	}

	newRefreshToken, err := app.issueRefreshToken(rt.UserID)
	if err != nil {
		c.Error(&middleware.DBError{Err: err})
		return
	}

	if err := models.DeleteRefreshToken(app.DB, rt.ID); err != nil {
		c.Error(&middleware.DBError{Err: err})
		return
	}

	c.JSON(http.StatusOK, RefreshPresenter{Token: token, RefreshToken: newRefreshToken})
}
