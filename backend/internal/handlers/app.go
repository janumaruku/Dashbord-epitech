package handlers

import (
	"os"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/database"
)

type App struct {
	DB                 *gorm.DB
	GithubClientID     string
	GithubClientSecret string
	GithubRedirectURI  string
}

func NewApp() (*App, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	return &App{
		DB:                 db,
		GithubClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		GithubClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		GithubRedirectURI:  os.Getenv("GITHUB_REDIRECT_URI"),
	}, nil
}
