package handlers

import (
	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
)

func RegisterRoutes(r *gin.Engine, app *App) {
	r.GET("/about.json", AboutJSON)

	{
		authGroup := r.Group("/auth")
		authGroup.POST("/register", app.Register)
		authGroup.POST("/login", app.Login)
		authGroup.POST("/refresh", app.Refresh)
	}

	{
		apiGroup := r.Group("/api", middleware.Auth())
		apiGroup.GET("/services", app.ListServices)
		apiGroup.POST("/services/:id/subscribe", app.Subscribe)
	}
}
