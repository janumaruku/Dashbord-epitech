package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/usecases"
)

func (app *App) ListServices(c *gin.Context) {
	session, ok := middleware.GetSession(c)
	if !ok {
		c.Error(dashborderrors.ErrInternal)
		return
	}

	services, err := usecases.ListServices(app.DB, session.UserID)
	if err != nil {
		c.Error(err)
		return
	}

	presenters := make([]ServicePresenter, 0, len(services))
	for _, s := range services {
		presenters = append(presenters, NewServicePresenter(s.Service, s.Subscribed))
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

	var req struct {
		Code string `json:"code"`
	}
	if c.Request.ContentLength > 0 {
		if err := c.ShouldBindJSON(&req); err != nil {
			c.Error(dashborderrors.ErrInvalidRequestBody)
			return
		}
	}

	github := usecases.GithubOAuthConfig{
		ClientID:     app.GithubClientID,
		ClientSecret: app.GithubClientSecret,
		RedirectURI:  app.GithubRedirectURI,
	}

	result, err := usecases.Subscribe(app.DB, session.UserID, serviceID, req.Code, github)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, NewSubscriptionPresenter(result))
}

func (app *App) Unsubscribe(c *gin.Context) {
	session, ok := middleware.GetSession(c)
	if !ok {
		c.Error(dashborderrors.ErrInternal)
		return
	}

	serviceID := c.Param("id")

	if err := usecases.Unsubscribe(app.DB, session.UserID, serviceID); err != nil {
		c.Error(err)
		return
	}

	c.Status(http.StatusOK)
}
