package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/janumaruku/Dashbord-epitech/backend/config"
	"github.com/joho/godotenv"
)

func main() {
	if godotenv.Load(".env") != nil {
		log.Printf("No .env file found")
	}

	var port = config.MustGetenv("PORT")

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
