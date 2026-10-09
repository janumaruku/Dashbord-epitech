package handlers

import (
	"errors"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/usecases"
)

type subscribeRequest struct {
	Code string `json:"code"`
}

func (app *App) ListServices(c *gin.Context) {
	services, err := usecases.ListServices(app.DB)
	if err != nil {
		c.Error(err)
		return
	}

	presenters := make([]ServicePresenter, 0, len(services))
	for _, s := range services {
		presenters = append(presenters, NewServicePresenter(s))
	}

	c.JSON(http.StatusOK, presenters)
}

func (app *App) Subscribe(c *gin.Context) {
	session, ok := middleware.GetSession(c)
	if !ok {
		c.Error(dashborderrors.ErrInternal)
		return
	}

	var req subscribeRequest
	if err := c.ShouldBindJSON(&req); err != nil && !errors.Is(err, io.EOF) {
		c.Error(dashborderrors.ErrInvalidRequestBody)
		return
	}

	serviceID := c.Param("id")

	result, err := usecases.Subscribe(app.DB, session.UserID, serviceID, req.Code)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, NewSubscriptionPresenter(result))
}
