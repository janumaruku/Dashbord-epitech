package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/usecases"
)

func (app *App) ListServices(c *gin.Context) {
	services, err := usecases.ListServices(app.DB)
	if err != nil {
		var dbErr *usecases.DBError
		if errors.As(err, &dbErr) {
			c.Error(&middleware.DBError{Err: dbErr.Err})
		} else {
			c.Error(&middleware.ServerError{Err: err})
		}
		return
	}

	presenters := make([]ServicePresenter, 0, len(services))
	for _, s := range services {
		presenters = append(presenters, NewServicePresenter(s))
	}

	c.JSON(http.StatusOK, presenters)
}
