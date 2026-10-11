package handlers

import (
	"time"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
)

func RegisterRoutes(r *gin.Engine, app *App) {
	r.GET("/about.json", app.AboutJSON)

	{
		authGroup := r.Group("/auth")
		authGroup.POST("/register", middleware.RateLimitByIP(3, time.Hour), app.Register)
		authGroup.POST("/login", middleware.RateLimitByIP(5, 15*time.Minute), app.Login)
		authGroup.POST("/refresh", app.Refresh)
	}

	apiRateLimit := middleware.RateLimitByUser(100, time.Minute)

	{
		apiGroup := r.Group("/api", middleware.Auth(), apiRateLimit)
		apiGroup.GET("/services", app.ListServices)
		apiGroup.POST("/services/:id/subscribe", app.Subscribe)
		apiGroup.DELETE("/services/:id/subscribe", app.Unsubscribe)
		apiGroup.GET("/widgets", app.ListWidgetCatalog)
	}

	{
		dashboardGroup := r.Group("/dashboard", middleware.Auth(), apiRateLimit)
		dashboardGroup.POST("/widgets", app.CreateWidgetInstance)
		dashboardGroup.GET("/widgets", app.ListWidgetInstances)
		dashboardGroup.PUT("/widgets/:id", app.UpdateWidgetInstance)
		dashboardGroup.DELETE("/widgets/:id", app.DeleteWidgetInstance)
	}
}
