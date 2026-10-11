package usecases

import (
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

type AboutWidget struct {
	Name        string
	Description string
	Params      []models.WidgetParam
}

type AboutService struct {
	Name    string
	Widgets []AboutWidget
}

func ListServicesWithWidgets(db *gorm.DB) ([]AboutService, error) {
	services, err := models.ListServices(db)
	if err != nil {
		return nil, err
	}

	widgets, err := models.ListWidgetsWithParams(db)
	if err != nil {
		return nil, err
	}

	widgetsByService := make(map[string][]AboutWidget, len(services))
	for _, w := range widgets {
		widgetsByService[w.ServiceID] = append(widgetsByService[w.ServiceID], AboutWidget{
			Name:        w.Name,
			Description: w.Description,
			Params:      w.Params,
		})
	}

	result := make([]AboutService, 0, len(services))
	for _, s := range services {
		result = append(result, AboutService{
			Name:    s.Name,
			Widgets: widgetsByService[s.ID],
		})
	}

	return result, nil
}
