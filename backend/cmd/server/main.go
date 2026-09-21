package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := gin.Default()

	r.GET("/about.json", AboutJSON)

	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}

func AboutJSON(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"ans": "OK",
	})
}
