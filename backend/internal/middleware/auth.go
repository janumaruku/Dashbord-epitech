package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/auth"
)

const (
	msgMissingAuthHeader = "Missing or invalid authorization header"
	msgInvalidToken      = "Invalid or expired token"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" || parts[1] == "" {
			c.Error(&DashbordError{Status: http.StatusUnauthorized, Message: msgMissingAuthHeader})
			c.Abort()
			return
		}

		userID, err := auth.ParseToken(parts[1])
		if err != nil {
			c.Error(&DashbordError{Status: http.StatusUnauthorized, Message: msgInvalidToken})
			c.Abort()
			return
		}

		SetSession(c, &Session{UserID: userID})
		c.Next()
	}
}
