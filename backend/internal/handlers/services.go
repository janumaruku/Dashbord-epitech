package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/usecases"
)

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

	serviceID := c.Param("id")

	result, err := usecases.Subscribe(app.DB, session.UserID, serviceID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, NewSubscriptionPresenter(result))
}
