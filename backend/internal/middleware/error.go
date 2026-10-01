package middleware

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Fixed, pre-built messages for error kinds that must never leak internal
// detail to the client (doc.md §9: error messages stay generic, never
// expose SQL queries, file paths, or stack traces). ServerError and DBError
// always render one of these, regardless of what the underlying error
// actually says — the real error is kept on the struct for server-side
// logging only, never sent to the client.
const (
	MsgInternalServerError = "Internal server error"
	MsgDatabaseError       = "A database error occurred"
	MsgDuplicateEntry      = "This value already exists"
)

// ServerError wraps an unexpected internal failure (crypto, JWT signing,
// anything that isn't a database call). Always renders as a 500 with the
// fixed MsgInternalServerError message.
type ServerError struct {
	Err error
}

func (e *ServerError) Error() string {
	return MsgInternalServerError
}

// DBError wraps a database-layer failure (a GORM query/create/etc. error).
// Renders as a 500 with the fixed MsgDatabaseError message, except for a
// duplicate-key violation, which is the client's fault (not a server
// failure) and renders as a 409 with MsgDuplicateEntry instead.
type DBError struct {
	Err error
}

func (e *DBError) Status() int {
	if errors.Is(e.Err, gorm.ErrDuplicatedKey) {
		return http.StatusConflict
	}

	return http.StatusInternalServerError
}

func (e *DBError) Error() string {
	if errors.Is(e.Err, gorm.ErrDuplicatedKey) {
		return MsgDuplicateEntry
	}

	return MsgDatabaseError
}

// DashbordError is a business-logic error — invalid input, a conflict, an
// unmet precondition. Unlike ServerError/DBError, its message is meant to
// be shown to the user, so it's provided per call site rather than fixed.
type DashbordError struct {
	Status  int
	Message string
}

func (e *DashbordError) Error() string {
	return e.Message
}

type errorGroup struct {
	Code     string   `json:"code"`
	Messages []string `json:"messages"`
}

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) == 0 {
			return
		}

		groups := map[string]*errorGroup{}
		var order []string
		status := 0

		for _, ginErr := range c.Errors {
			var code string
			var message string
			var errStatus int

			switch e := ginErr.Err.(type) {
			case *DashbordError:
				code = "DASHBORD_ERROR"
				message = e.Message
				errStatus = e.Status
			case *DBError:
				code = "DB_ERROR"
				message = e.Error()
				errStatus = e.Status()
			case *ServerError:
				code = "SERVER_ERROR"
				message = MsgInternalServerError
				errStatus = http.StatusInternalServerError
			default:
				code = "SERVER_ERROR"
				message = MsgInternalServerError
				errStatus = http.StatusInternalServerError
			}

			if _, exists := groups[code]; !exists {
				groups[code] = &errorGroup{Code: code}
				order = append(order, code)
			}
			groups[code].Messages = append(groups[code].Messages, message)

			if errStatus > status {
				status = errStatus
			}
		}

		result := make([]*errorGroup, 0, len(order))
		for _, code := range order {
			result = append(result, groups[code])
		}

		c.JSON(status, gin.H{"errors": result})
	}
}
