package cmd

import (
	"github.com/spf13/cobra"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/database"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

type seedParam struct {
	Name        string
	Type        string
	Description string
}

type seedWidget struct {
	Name        string
	Description string
	Params      []seedParam
}

type seedService struct {
	Name          string
	Description   string
	RequiresAuth  bool
	OAuthProvider *string
	Widgets       []seedWidget
}

func githubProvider() *string {
	provider := "github"
	return &provider
}

var seedData = []seedService{
	{
		Name:         "weather",
		Description:  "Weather data from OpenWeatherMap",
		RequiresAuth: false,
		Widgets: []seedWidget{
			{
				Name:        "city_temperature",
				Description: "Temperature, condition, and humidity for a city",
				Params: []seedParam{
					{Name: "city", Type: "string", Description: "City name"},
					{Name: "units", Type: "string", Description: "celsius or fahrenheit"},
				},
			},
			{
				Name:        "city_forecast",
				Description: "Multi-day forecast for a city",
				Params: []seedParam{
					{Name: "city", Type: "string", Description: "City name"},
					{Name: "days", Type: "integer", Description: "Number of days, 1-5"},
				},
			},
			{
				Name:        "current_conditions",
				Description: "Wind speed, pressure, and UV index for a city",
				Params: []seedParam{
					{Name: "city", Type: "string", Description: "City name"},
				},
			},
		},
	},
	{
		Name:          "github",
		Description:   "GitHub activity and repositories",
		RequiresAuth:  true,
		OAuthProvider: githubProvider(),
		Widgets: []seedWidget{
			{
				Name:        "user_profile",
				Description: "Avatar, name, bio, followers, and public repos",
				Params: []seedParam{
					{Name: "username", Type: "string", Description: "GitHub username"},
				},
			},
			{
				Name:        "recent_repos",
				Description: "List of recently updated repositories",
				Params: []seedParam{
					{Name: "username", Type: "string", Description: "GitHub username"},
					{Name: "limit", Type: "integer", Description: "Number of repositories, 1-10"},
				},
			},
			{
				Name:        "recent_commits",
				Description: "Recent commits with authors",
				Params: []seedParam{
					{Name: "owner", Type: "string", Description: "Repository owner"},
					{Name: "repo", Type: "string", Description: "Repository name"},
					{Name: "limit", Type: "integer", Description: "Number of commits, 1-20"},
				},
			},
		},
	},
	{
		Name:         "rss",
		Description:  "Keep up with your user-provided feeds",
		RequiresAuth: false,
		Widgets: []seedWidget{
			{
				Name:        "feed_latest",
				Description: "List of latest articles with dates",
				Params: []seedParam{
					{Name: "feed_url", Type: "string", Description: "Feed URL, must start with https://"},
					{Name: "limit", Type: "integer", Description: "Number of articles, 1-20"},
				},
			},
			{
				Name:        "feed_summary",
				Description: "Feed title, description, and article count",
				Params: []seedParam{
					{Name: "feed_url", Type: "string", Description: "Feed URL, must start with https://"},
				},
			},
		},
	},
	{
		Name:         "clock",
		Description:  "Analog and digital clocks for any city",
		RequiresAuth: false,
		Widgets: []seedWidget{
			{
				Name:        "analog_clock",
				Description: "Analog clock face for a timezone",
				Params: []seedParam{
					{Name: "timezone", Type: "string", Description: "IANA timezone name, e.g. Europe/Paris"},
				},
			},
			{
				Name:        "digital_clock",
				Description: "Digital time display for a timezone",
				Params: []seedParam{
					{Name: "timezone", Type: "string", Description: "IANA timezone name, e.g. Europe/Paris"},
				},
			},
		},
	},
}

var seedCommand = &cobra.Command{
	Use:   "seed",
	Short: "Seed services and widgets data",
	RunE: func(cmd *cobra.Command, args []string) error {
		db, err := database.Connect()
		if err != nil {
			return err
		}

		for _, s := range seedData {
			service := models.Service{
				Name:          s.Name,
				Description:   s.Description,
				RequiresAuth:  s.RequiresAuth,
				OAuthProvider: s.OAuthProvider,
			}
			if err := db.Where(models.Service{Name: s.Name}).
				Attrs(service).
				FirstOrCreate(&service).Error; err != nil {
				return err
			}

			for _, w := range s.Widgets {
				widget := models.Widget{
					ServiceID:   service.ID,
					Name:        w.Name,
					Description: w.Description,
				}
				if err := db.Where(models.Widget{ServiceID: service.ID, Name: w.Name}).
					Attrs(widget).
					FirstOrCreate(&widget).Error; err != nil {
					return err
				}

				for _, p := range w.Params {
					param := models.WidgetParam{
						WidgetID:    widget.ID,
						Name:        p.Name,
						Type:        p.Type,
						Description: p.Description,
					}
					if err := db.Where(models.WidgetParam{WidgetID: widget.ID, Name: p.Name}).
						Attrs(param).
						FirstOrCreate(&param).Error; err != nil {
						return err
					}
				}
			}
		}

		cmd.Println("seed: done")
		return nil
	},
}

func init() {
	rootCommand.AddCommand(seedCommand)
}
