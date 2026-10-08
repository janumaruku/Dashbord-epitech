package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/auth"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
)

var ErrMissingAuthHeader = &dashborderrors.DashboardError{
	Code:    "MISSING_AUTH_HEADER",
	Message: "Missing or invalid authorization header",
	Status:  http.StatusUnauthorized,
}

var ErrInvalidToken = &dashborderrors.DashboardError{
	Code:    "INVALID_TOKEN",
	Message: "Invalid or expired token",
	Status:  http.StatusUnauthorized,
}

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" || parts[1] == "" {
			c.Error(ErrMissingAuthHeader)
			c.Abort()
			return
		}

		userID, err := auth.ParseToken(parts[1])
		if err != nil {
			c.Error(ErrInvalidToken)
			c.Abort()
			return
		}

		SetSession(c, &Session{UserID: userID})
		c.Next()
	}
}
