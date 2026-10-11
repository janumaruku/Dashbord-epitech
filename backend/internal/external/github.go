package external

import "github.com/janumaruku/Dashbord-epitech/backend/internal/models"

func FetchGithubWidget(oauthToken, widgetName string, config models.JSONMap) (models.JSONMap, error) {
	return nil, &FetchError{Message: "GitHub widgets are not implemented yet"}
}
