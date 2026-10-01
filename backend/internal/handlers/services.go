package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

func (app *App) ListServices(c *gin.Context) {
	services, err := models.ListServices(app.DB)
	if err != nil {
		c.Error(&middleware.DBError{Err: err})
		return
	}

	presenters := make([]ServicePresenter, 0, len(services))
	for _, s := range services {
		presenters = append(presenters, NewServicePresenter(s))
	}

	c.JSON(http.StatusOK, presenters)
}
