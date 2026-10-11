package usecases

import (
	"math"
	"net/http"
	"time"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

var ErrNotSubscribed = &dashborderrors.DashboardError{
	Code:    "NOT_SUBSCRIBED",
	Message: "Subscribe to this widget's service first",
	Status:  http.StatusBadRequest,
}

var ErrInvalidWidgetConfig = &dashborderrors.DashboardError{
	Code:    "INVALID_WIDGET_CONFIG",
	Message: "Configuration does not match this widget's parameters",
	Status:  http.StatusBadRequest,
}

var ErrInvalidRefreshRate = &dashborderrors.DashboardError{
	Code:    "INVALID_REFRESH_RATE",
	Message: "Refresh rate must be between 5 and 3600 seconds",
	Status:  http.StatusBadRequest,
}

var ErrInvalidPosition = &dashborderrors.DashboardError{
	Code:    "INVALID_POSITION",
	Message: "Position must have x >= 0, y >= 0, w > 0, h > 0",
	Status:  http.StatusBadRequest,
}

var ErrWidgetInstanceForbidden = &dashborderrors.DashboardError{
	Code:    "WIDGET_INSTANCE_FORBIDDEN",
	Message: "This widget instance belongs to another user",
	Status:  http.StatusForbidden,
}

type WidgetInstanceWithData struct {
	Instance  models.WidgetInstance
	Data      models.JSONMap
	FetchedAt *time.Time
	Cached    bool
	Warning   string
}

func CreateWidgetInstance(db *gorm.DB, userID, widgetID string, config models.JSONMap, refreshRate int, position models.Position) (*models.WidgetInstance, error) {
	widget, err := models.FindWidgetByID(db, widgetID)
	if err != nil {
		return nil, err
	}

	subscribed, err := models.UserServiceExists(db, userID, widget.ServiceID)
	if err != nil {
		return nil, err
	}
	if !subscribed {
		return nil, ErrNotSubscribed
	}

	if !validRefreshRate(refreshRate) {
		return nil, ErrInvalidRefreshRate
	}

	if !validPosition(position) {
		return nil, ErrInvalidPosition
	}

	if !validWidgetConfig(widget.Params, config) {
		return nil, ErrInvalidWidgetConfig
	}

	instance := models.WidgetInstance{
		UserID:      userID,
		WidgetID:    widgetID,
		Config:      config,
		RefreshRate: refreshRate,
		Position:    position,
	}

	if err := models.CreateWidgetInstance(db, &instance); err != nil {
		return nil, err
	}

	return &instance, nil
}

func ListWidgetInstances(db *gorm.DB, userID, openWeatherAPIKey string) ([]WidgetInstanceWithData, error) {
	instances, err := models.ListWidgetInstancesByUser(db, userID)
	if err != nil {
		return nil, err
	}

	result := make([]WidgetInstanceWithData, 0, len(instances))
	for _, instance := range instances {
		widget, err := models.FindWidgetByID(db, instance.WidgetID)
		if err != nil {
			return nil, err
		}

		subscribed, err := models.UserServiceExists(db, userID, widget.ServiceID)
		if err != nil {
			return nil, err
		}
		if !subscribed {
			continue
		}

		if isClockWidgetName(widget.Name) {
			result = append(result, WidgetInstanceWithData{Instance: instance})
			continue
		}

		refresh, err := RefreshWidgetData(db, userID, instance, *widget, openWeatherAPIKey)
		if err != nil {
			return nil, err
		}

		result = append(result, WidgetInstanceWithData{
			Instance:  instance,
			Data:      refresh.Data,
			FetchedAt: refresh.FetchedAt,
			Cached:    refresh.Cached,
			Warning:   refresh.Warning,
		})
	}

	return result, nil
}

type WidgetInstanceUpdate struct {
	Config      *models.JSONMap
	RefreshRate *int
	Position    *models.Position
}

func UpdateWidgetInstance(db *gorm.DB, userID, instanceID string, update WidgetInstanceUpdate) (*models.WidgetInstance, error) {
	instance, err := models.FindWidgetInstanceByID(db, instanceID)
	if err != nil {
		return nil, err
	}

	if instance.UserID != userID {
		return nil, ErrWidgetInstanceForbidden
	}

	if update.RefreshRate != nil {
		if !validRefreshRate(*update.RefreshRate) {
			return nil, ErrInvalidRefreshRate
		}
		instance.RefreshRate = *update.RefreshRate
	}

	if update.Position != nil {
		if !validPosition(*update.Position) {
			return nil, ErrInvalidPosition
		}
		instance.Position = *update.Position
	}

	if update.Config != nil {
		widget, err := models.FindWidgetByID(db, instance.WidgetID)
		if err != nil {
			return nil, err
		}
		if !validWidgetConfig(widget.Params, *update.Config) {
			return nil, ErrInvalidWidgetConfig
		}
		instance.Config = *update.Config
	}

	if err := models.UpdateWidgetInstance(db, instance); err != nil {
		return nil, err
	}

	if update.Config != nil {
		if err := models.DeleteWidgetDataForInstance(db, instance.ID); err != nil {
			return nil, err
		}
	}

	return instance, nil
}

func DeleteWidgetInstance(db *gorm.DB, userID, instanceID string) error {
	instance, err := models.FindWidgetInstanceByID(db, instanceID)
	if err != nil {
		return err
	}

	if instance.UserID != userID {
		return ErrWidgetInstanceForbidden
	}

	return models.DeleteWidgetInstance(db, instance.ID)
}

func validRefreshRate(rate int) bool {
	return rate >= 5 && rate <= 3600
}

func validPosition(p models.Position) bool {
	return p.X >= 0 && p.Y >= 0 && p.W > 0 && p.H > 0
}

func validWidgetConfig(params []models.WidgetParam, config models.JSONMap) bool {
	allowed := make(map[string]string, len(params))
	for _, p := range params {
		allowed[p.Name] = p.Type
	}

	for key := range config {
		if _, ok := allowed[key]; !ok {
			return false
		}
	}

	for _, p := range params {
		value, ok := config[p.Name]
		if !ok {
			return false
		}

		switch p.Type {
		case "string":
			if _, ok := value.(string); !ok {
				return false
			}
		case "integer":
			num, ok := value.(float64)
			if !ok || num != math.Trunc(num) {
				return false
			}
		}
	}

	return true
}
