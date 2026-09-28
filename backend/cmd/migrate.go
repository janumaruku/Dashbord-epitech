package cmd

import "github.com/spf13/cobra"

var migrateCommand = &cobra.Command{
	Use:   "migrate",
	Short: "Manage database migrations",
}

func init() {
	rootCommand.AddCommand(migrateCommand)
}
