package cmd

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
)

var rootCommand = &cobra.Command{
	Use:   "dashbord",
	Short: "Customizable real-time information aggregation platform",
	Long: `The Epitech Dashboard is a customizable real-time information aggregation
platform. Authenticated users can subscribe to external services (weather, GitHub, RSS feeds)
and create a personalized dashboard with drag-and-drop widgets. Each widget displays live data
from a configured service and automatically refreshes at user-defined intervals.`,
	PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
		if err := godotenv.Load(".env"); err != nil {
			log.Printf("No .env file found")
		}

		return nil
	},
}

func Execute() error {
	return rootCommand.Execute()
}
