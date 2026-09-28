package cmd

import "github.com/spf13/cobra"

var migrateCommand = &cobra.Command{
	Use:   "migrate",
	Short: "Manage database migrations",
}

var migrateUpCommand = &cobra.Command{
	Use:   "up",
	Short: "Apply all pending migrations",
	RunE: func(cmd *cobra.Command, args []string) error {
		cmd.Println("migrate up: not implemented yet")
		return nil
	},
}

func init() {
	migrateCommand.AddCommand(migrateUpCommand)
	rootCommand.AddCommand(migrateCommand)
}
