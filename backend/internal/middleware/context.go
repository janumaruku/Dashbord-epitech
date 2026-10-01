package middleware

import "github.com/gin-gonic/gin"

const sessionKey = "session"

type Session struct {
	UserID string
}

func SetSession(c *gin.Context, s *Session) {
	c.Set(sessionKey, s)
}

func GetSession(c *gin.Context) (*Session, bool) {
	v, exists := c.Get(sessionKey)
	if !exists {
		return nil, false
	}

	s, ok := v.(*Session)
	return s, ok
}
