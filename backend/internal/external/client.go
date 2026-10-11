package external

import (
	"net/http"
	"time"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

var httpClient = &http.Client{Timeout: 8 * time.Second}

func intFromConfig(config models.JSONMap, key string, fallback, min, max int) int {
	v, ok := config[key].(float64)
	if !ok {
		return fallback
	}

	n := int(v)
	if n < min {
		return min
	}
	if n > max {
		return max
	}

	return n
}
