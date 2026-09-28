package cli

import (
	"fmt"

	"github.com/spf13/cobra"
)

var rootCommand = &cobra.Command{
	Use:   "dashbord",
	Short: "Customizable real-time information aggregation platform",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf(`The Epitech Dashboard is a customizable real-time information aggregation
platform. Authenticated users can subscribe to external services (weather, GitHub, RSS feeds)
and create a personalized dashboard with drag-and-drop widgets. Each widget displays live data
from a configured service and automatically refreshes at user-defined intervals.`)
	},
}

func Execute() error {
	return rootCommand.Execute()
}
