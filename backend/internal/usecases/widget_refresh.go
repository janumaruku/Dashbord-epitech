package usecases

import (
	"time"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/external"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

type WidgetRefreshResult struct {
	Data      models.JSONMap
	FetchedAt *time.Time
	Cached    bool
	Warning   string
}

func RefreshWidgetData(
	db *gorm.DB,
	userID string,
	instance models.WidgetInstance,
	widget models.Widget,
	openWeatherAPIKey string,
) (*WidgetRefreshResult, error) {
	cached, err := models.FindLatestWidgetData(db, instance.ID)
	if err != nil {
		return nil, err
	}

	if cached != nil && cached.ExpiresAt != nil && cached.ExpiresAt.After(time.Now()) {
		return &WidgetRefreshResult{Data: cached.Data, FetchedAt: &cached.FetchedAt, Cached: true}, nil
	}

	service, err := models.FindServiceByID(db, widget.ServiceID)
	if err != nil {
		return nil, err
	}

	fresh, fetchErr := fetchExternalData(db, userID, service, widget, instance, openWeatherAPIKey)
	if fetchErr == nil {
		now := time.Now()
		expiresAt := now.Add(time.Duration(instance.RefreshRate) * time.Second)

		if err := models.SaveWidgetData(db, &models.WidgetData{
			WidgetInstanceID: instance.ID,
			Data:             fresh,
			FetchedAt:        now,
			ExpiresAt:        &expiresAt,
		}); err != nil {
			return nil, err
		}

		return &WidgetRefreshResult{Data: fresh, FetchedAt: &now, Cached: false}, nil
	}

	if cached != nil {
		return &WidgetRefreshResult{
			Data:      cached.Data,
			FetchedAt: &cached.FetchedAt,
			Cached:    true,
			Warning:   fetchErr.Error(),
		}, nil
	}

	return &WidgetRefreshResult{Warning: fetchErr.Error()}, nil
}

func fetchExternalData(
	db *gorm.DB,
	userID string,
	service *models.Service,
	widget models.Widget,
	instance models.WidgetInstance,
	openWeatherAPIKey string,
) (models.JSONMap, error) {
	switch service.Name {
	case "weather":
		return external.FetchWeatherWidget(openWeatherAPIKey, widget.Name, instance.Config)
	case "github":
		us, err := models.FindUserService(db, userID, service.ID)
		if err != nil {
			return nil, err
		}
		token := ""
		if us != nil {
			token = string(us.OAuthToken)
		}
		return external.FetchGithubWidget(token, widget.Name, instance.Config)
	case "rss":
		return external.FetchRSSWidget(widget.Name, instance.Config)
	default:
		return nil, nil
	}
}

func isClockWidgetName(name string) bool {
	return name == "analog_clock" || name == "digital_clock"
}
