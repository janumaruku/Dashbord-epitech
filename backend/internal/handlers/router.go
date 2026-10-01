package handlers

import (
	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
)

func RegisterRoutes(r *gin.Engine, app *App) {
	r.GET("/about.json", AboutJSON)
	r.POST("/auth/register", app.Register)
	r.POST("/auth/login", app.Login)
	r.POST("/auth/refresh", app.Refresh)
	r.GET("/api/services", middleware.Auth(), app.ListServices)
}
