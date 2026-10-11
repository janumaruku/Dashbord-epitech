package external

import "github.com/janumaruku/Dashbord-epitech/backend/internal/models"

func FetchRSSWidget(widgetName string, config models.JSONMap) (models.JSONMap, error) {
	return nil, &FetchError{Message: "RSS widgets are not implemented yet"}
}
