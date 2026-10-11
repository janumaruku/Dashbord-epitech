package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/usecases"
)

func (app *App) AboutJSON(c *gin.Context) {
	services, err := usecases.ListServicesWithWidgets(app.DB)
	if err != nil {
		c.Error(err)
		return
	}

	servicePresenters := make([]AboutServicePresenter, 0, len(services))
	for _, s := range services {
		servicePresenters = append(servicePresenters, NewAboutServicePresenter(s))
	}

	presenter := AboutPresenter{
		Server: AboutServerPresenter{
			CurrentTime: time.Now().Unix(),
			Services:    servicePresenters,
		},
	}
	presenter.Client.Host = c.ClientIP()

	c.JSON(http.StatusOK, presenter)
}
