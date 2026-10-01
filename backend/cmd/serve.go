package cmd

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/janumaruku/Dashbord-epitech/backend/config"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/handlers"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
	"github.com/spf13/cobra"
)

var serveCommand = &cobra.Command{
	Use:   "serve",
	Short: "Serve a HTTP server",
	RunE: func(cmd *cobra.Command, args []string) error {
		var port = config.MustGetenv("PORT")

		app, err := handlers.NewApp()
		if err != nil {
			return err
		}

		r := gin.Default()
		r.Use(middleware.ErrorHandler())
		handlers.RegisterRoutes(r, app)

		if err := r.Run(":" + port); err != nil {
			log.Fatal(err)
		}

		return nil
	},
}

func init() {
	rootCommand.AddCommand(serveCommand)
}
