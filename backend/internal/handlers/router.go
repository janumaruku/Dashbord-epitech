package handlers

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, app *App) {
	r.GET("/about.json", AboutJSON)
}
