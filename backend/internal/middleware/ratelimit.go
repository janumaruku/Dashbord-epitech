package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
)

var ErrRateLimited = &dashborderrors.DashboardError{
	Code:    "RATE_LIMITED",
	Message: "Too many requests, please try again later",
	Status:  http.StatusTooManyRequests,
}

type windowCounter struct {
	count       int
	windowStart time.Time
}

type rateLimiter struct {
	mu       sync.Mutex
	limit    int
	window   time.Duration
	counters map[string]*windowCounter
}

func newRateLimiter(limit int, window time.Duration) *rateLimiter {
	return &rateLimiter{
		limit:    limit,
		window:   window,
		counters: make(map[string]*windowCounter),
	}
}

func (rl *rateLimiter) allow(key string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()

	c, exists := rl.counters[key]
	if !exists || now.Sub(c.windowStart) >= rl.window {
		rl.counters[key] = &windowCounter{count: 1, windowStart: now}
		return true
	}

	if c.count >= rl.limit {
		return false
	}

	c.count++
	return true
}

func RateLimit(limit int, window time.Duration, keyFunc func(*gin.Context) string) gin.HandlerFunc {
	rl := newRateLimiter(limit, window)

	return func(c *gin.Context) {
		if !rl.allow(keyFunc(c)) {
			c.Error(ErrRateLimited)
			c.Abort()
			return
		}

		c.Next()
	}
}

func RateLimitByIP(limit int, window time.Duration) gin.HandlerFunc {
	return RateLimit(limit, window, func(c *gin.Context) string {
		return c.ClientIP()
	})
}

func RateLimitByUser(limit int, window time.Duration) gin.HandlerFunc {
	return RateLimit(limit, window, func(c *gin.Context) string {
		session, ok := GetSession(c)
		if !ok {
			return c.ClientIP()
		}

		return session.UserID
	})
}
