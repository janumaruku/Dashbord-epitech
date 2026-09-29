package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AboutJSON(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"ans": "OK",
	})
}
