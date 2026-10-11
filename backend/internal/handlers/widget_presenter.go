package handlers

import (
	"time"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

type WidgetParamPresenter struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	Description string `json:"description"`
}

type WidgetCatalogPresenter struct {
	ID          string                 `json:"id"`
	ServiceID   string                 `json:"service_id"`
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Params      []WidgetParamPresenter `json:"params"`
}

func NewWidgetCatalogPresenter(w models.Widget) WidgetCatalogPresenter {
	params := make([]WidgetParamPresenter, 0, len(w.Params))
	for _, p := range w.Params {
		params = append(params, WidgetParamPresenter{
			Name:        p.Name,
			Type:        p.Type,
			Description: p.Description,
		})
	}

	return WidgetCatalogPresenter{
		ID:          w.ID,
		ServiceID:   w.ServiceID,
		Name:        w.Name,
		Description: w.Description,
		Params:      params,
	}
}

type WidgetInstancePresenter struct {
	ID          string          `json:"id"`
	WidgetID    string          `json:"widget_id"`
	Config      models.JSONMap  `json:"config"`
	RefreshRate int             `json:"refresh_rate"`
	Position    models.Position `json:"position"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	Data        any             `json:"data"`
	FetchedAt   *time.Time      `json:"fetched_at"`
	Cached      bool            `json:"cached"`
	Warning     *string         `json:"warning"`
}

type WidgetInstanceData struct {
	Data      models.JSONMap
	FetchedAt *time.Time
	Cached    bool
	Warning   string
}

func NewWidgetInstancePresenter(instance models.WidgetInstance, data WidgetInstanceData) WidgetInstancePresenter {
	p := WidgetInstancePresenter{
		ID:          instance.ID,
		WidgetID:    instance.WidgetID,
		Config:      instance.Config,
		RefreshRate: instance.RefreshRate,
		Position:    instance.Position,
		CreatedAt:   instance.CreatedAt,
		UpdatedAt:   instance.UpdatedAt,
		Data:        data.Data,
		FetchedAt:   data.FetchedAt,
		Cached:      data.Cached,
	}

	if data.Warning != "" {
		p.Warning = &data.Warning
	}

	return p
}
