package middleware

import (
	"errors"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) == 0 {
			return
		}

		err := c.Errors.Last().Err

		var dashErr *dashborderrors.DashbordError
		if !errors.As(err, &dashErr) {
			dashErr = dashborderrors.ErrInternal
		}

		c.JSON(dashErr.Status, dashErr)
	}
}
