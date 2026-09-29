package handlers

import (
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/database"
)

type App struct {
	DB *gorm.DB
}

func NewApp() (*App, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	return &App{DB: db}, nil
}
