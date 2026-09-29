package cmd

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/pressly/goose/v3"
	"github.com/spf13/cobra"

	"github.com/janumaruku/Dashbord-epitech/backend/config"
)

const migrationsDir = "migrations"

func openMigrationsDB() (*sql.DB, error) {
	db, err := sql.Open("mysql", config.MySQLDSN())
	if err != nil {
		return nil, fmt.Errorf("opening database connection: %w", err)
	}

	if err := goose.SetDialect("mysql"); err != nil {
		return nil, fmt.Errorf("setting goose dialect: %w", err)
	}

	return db, nil
}

var migrateCommand = &cobra.Command{
	Use:   "migrate",
	Short: "Manage database migrations",
}

var migrateUpCommand = &cobra.Command{
	Use:   "up",
	Short: "Apply all pending migrations",
	RunE: func(cmd *cobra.Command, args []string) error {
		db, err := openMigrationsDB()
		if err != nil {
			return err
		}
		defer db.Close()

		return goose.Up(db, migrationsDir)
	},
}

var migrateDownCommand = &cobra.Command{
	Use:   "down",
	Short: "Roll back the last migration",
	RunE: func(cmd *cobra.Command, args []string) error {
		db, err := openMigrationsDB()
		if err != nil {
			return err
		}
		defer db.Close()

		return goose.Down(db, migrationsDir)
	},
}

func init() {
	migrateCommand.AddCommand(migrateUpCommand, migrateDownCommand)
	rootCommand.AddCommand(migrateCommand)
}
