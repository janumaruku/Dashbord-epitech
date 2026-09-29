package cmd

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/janumaruku/Dashbord-epitech/backend/config"
	"github.com/spf13/cobra"
)

var serveCommand = &cobra.Command{
	Use:   "serve",
	Short: "Serve a HTTP server",
	Long:  `Serve a HTTP server`,
	RunE: func(cmd *cobra.Command, args []string) error {
		var port = config.MustGetenv("PORT")

		r := gin.Default()

		r.GET("/about.json", AboutJSON)

		if err := r.Run(":" + port); err != nil {
			log.Fatal(err)
		}

		return nil
	},
}

func AboutJSON(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"ans": "OK",
	})
}

func init() {
	rootCommand.AddCommand(serveCommand)
}
