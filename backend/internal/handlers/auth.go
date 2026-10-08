package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/usecases"
)

func (app *App) Register(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(dashborderrors.ErrInvalidRequestBody)
		return
	}

	result, err := usecases.Register(app.DB, req.Username, req.Email, req.Password)
	if err != nil {
		c.Error(err)
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
		c.Error(dashborderrors.ErrInvalidRequestBody)
		return
	}

	result, err := usecases.Login(app.DB, req.Email, req.Password)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, NewAuthPresenter(result.Token, result.RefreshToken, result.User))
}

type refreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}

func (app *App) Refresh(c *gin.Context) {
	var req refreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(dashborderrors.ErrInvalidRequestBody)
		return
	}

	result, err := usecases.Refresh(app.DB, req.RefreshToken)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, RefreshPresenter{Token: result.Token, RefreshToken: result.RefreshToken})
}
