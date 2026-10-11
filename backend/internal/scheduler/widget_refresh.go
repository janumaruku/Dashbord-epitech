package scheduler

import (
	"context"
	"time"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/usecases"
)

const tickInterval = 60 * time.Second

// Run ticks every 60s, refreshing stale widget data in the background until
// ctx is cancelled. Each tick runs to completion (all spawned goroutines
// finished) before the next one starts or before Run returns, so callers can
// safely wait on Run returning as part of a graceful shutdown.
func Run(ctx context.Context, db *gorm.DB, openWeatherAPIKey string) {
	ticker := time.NewTicker(tickInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			usecases.RefreshAllStaleWidgets(db, openWeatherAPIKey)
		}
	}
}
