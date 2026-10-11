package handlers

import "github.com/janumaruku/Dashbord-epitech/backend/internal/usecases"

type AboutParamPresenter struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

type AboutWidgetPresenter struct {
	Name        string                `json:"name"`
	Description string                `json:"description"`
	Params      []AboutParamPresenter `json:"params"`
}

type AboutServicePresenter struct {
	Name    string                 `json:"name"`
	Widgets []AboutWidgetPresenter `json:"widgets"`
}

type AboutClientPresenter struct {
	Host string `json:"host"`
}

type AboutServerPresenter struct {
	CurrentTime int64                   `json:"current_time"`
	Services    []AboutServicePresenter `json:"services"`
}

type AboutPresenter struct {
	Client AboutClientPresenter `json:"client"`
	Server AboutServerPresenter `json:"server"`
}

func NewAboutServicePresenter(s usecases.AboutService) AboutServicePresenter {
	widgets := make([]AboutWidgetPresenter, 0, len(s.Widgets))
	for _, w := range s.Widgets {
		params := make([]AboutParamPresenter, 0, len(w.Params))
		for _, p := range w.Params {
			params = append(params, AboutParamPresenter{
				Name: p.Name,
				Type: p.Type,
			})
		}

		widgets = append(widgets, AboutWidgetPresenter{
			Name:        w.Name,
			Description: w.Description,
			Params:      params,
		})
	}

	return AboutServicePresenter{
		Name:    s.Name,
		Widgets: widgets,
	}
}
