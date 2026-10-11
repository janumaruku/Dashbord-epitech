package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/usecases"
)

func (app *App) ListWidgetCatalog(c *gin.Context) {
	widgets, err := usecases.ListWidgetCatalog(app.DB)
	if err != nil {
		c.Error(err)
		return
	}

	presenters := make([]WidgetCatalogPresenter, 0, len(widgets))
	for _, w := range widgets {
		presenters = append(presenters, NewWidgetCatalogPresenter(w))
	}

	c.JSON(http.StatusOK, presenters)
}

type createWidgetInstanceRequest struct {
	WidgetID    string          `json:"widget_id"`
	Config      models.JSONMap  `json:"config"`
	RefreshRate int             `json:"refresh_rate"`
	Position    models.Position `json:"position"`
}

func (app *App) CreateWidgetInstance(c *gin.Context) {
	session, ok := middleware.GetSession(c)
	if !ok {
		c.Error(dashborderrors.ErrInternal)
		return
	}

	var req createWidgetInstanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(dashborderrors.ErrInvalidRequestBody)
		return
	}

	instance, err := usecases.CreateWidgetInstance(app.DB, session.UserID, req.WidgetID, req.Config, req.RefreshRate, req.Position)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, NewWidgetInstancePresenter(*instance, nil))
}

func (app *App) ListWidgetInstances(c *gin.Context) {
	session, ok := middleware.GetSession(c)
	if !ok {
		c.Error(dashborderrors.ErrInternal)
		return
	}

	instances, err := usecases.ListWidgetInstances(app.DB, session.UserID)
	if err != nil {
		c.Error(err)
		return
	}

	presenters := make([]WidgetInstancePresenter, 0, len(instances))
	for _, item := range instances {
		presenters = append(presenters, NewWidgetInstancePresenter(item.Instance, item.Data))
	}

	c.JSON(http.StatusOK, presenters)
}

type updateWidgetInstanceRequest struct {
	Config      *models.JSONMap  `json:"config"`
	RefreshRate *int             `json:"refresh_rate"`
	Position    *models.Position `json:"position"`
}

func (app *App) UpdateWidgetInstance(c *gin.Context) {
	session, ok := middleware.GetSession(c)
	if !ok {
		c.Error(dashborderrors.ErrInternal)
		return
	}

	instanceID := c.Param("id")

	var req updateWidgetInstanceRequest
	if c.Request.ContentLength > 0 {
		if err := c.ShouldBindJSON(&req); err != nil {
			c.Error(dashborderrors.ErrInvalidRequestBody)
			return
		}
	}

	instance, err := usecases.UpdateWidgetInstance(app.DB, session.UserID, instanceID, usecases.WidgetInstanceUpdate{
		Config:      req.Config,
		RefreshRate: req.RefreshRate,
		Position:    req.Position,
	})
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, NewWidgetInstancePresenter(*instance, nil))
}

func (app *App) DeleteWidgetInstance(c *gin.Context) {
	session, ok := middleware.GetSession(c)
	if !ok {
		c.Error(dashborderrors.ErrInternal)
		return
	}

	instanceID := c.Param("id")

	if err := usecases.DeleteWidgetInstance(app.DB, session.UserID, instanceID); err != nil {
		c.Error(err)
		return
	}

	c.Status(http.StatusOK)
}
