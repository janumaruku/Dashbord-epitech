package cmd

import "github.com/spf13/cobra"

var seedCommand = &cobra.Command{
	Use:   "seed",
	Short: "Seed services and widgets data",
	RunE: func(cmd *cobra.Command, args []string) error {
		cmd.Println("seed: not implemented yet")
		return nil
	},
}

func init() {
	rootCommand.AddCommand(seedCommand)
}
