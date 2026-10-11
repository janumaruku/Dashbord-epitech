package cmd

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/janumaruku/Dashbord-epitech/backend/config"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/handlers"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/middleware"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/scheduler"
	"github.com/spf13/cobra"
)

var serveCommand = &cobra.Command{
	Use:   "serve",
	Short: "Serve a HTTP server",
	RunE: func(cmd *cobra.Command, args []string) error {
		var port = config.MustGetenv("PORT")

		frontendURL := os.Getenv("FRONTEND_URL")
		if frontendURL == "" {
			frontendURL = "http://localhost:3000"
		}

		app, err := handlers.NewApp()
		if err != nil {
			return err
		}

		r := gin.Default()
		r.Use(middleware.CORS(frontendURL))
		r.Use(middleware.ErrorHandler())
		handlers.RegisterRoutes(r, app)

		srv := &http.Server{
			Addr:    ":" + port,
			Handler: r,
		}

		ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
		defer stop()

		var schedulerWg sync.WaitGroup
		schedulerWg.Add(1)
		go func() {
			defer schedulerWg.Done()
			scheduler.Run(ctx, app.DB, app.OpenWeatherAPIKey)
		}()

		go func() {
			if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
				log.Fatalf("server error: %v", err)
			}
		}()

		<-ctx.Done()
		log.Println("shutting down...")

		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := srv.Shutdown(shutdownCtx); err != nil {
			return err
		}

		schedulerWg.Wait()

		return nil
	},
}

func init() {
	rootCommand.AddCommand(serveCommand)
}
