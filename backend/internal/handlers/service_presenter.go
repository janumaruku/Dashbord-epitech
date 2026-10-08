package handlers

import (
	"time"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/usecases"
)

type ServicePresenter struct {
	ID            string  `json:"id"`
	Name          string  `json:"name"`
	Description   string  `json:"description"`
	RequiresAuth  bool    `json:"requires_auth"`
	OAuthProvider *string `json:"oauth_provider"`
}

func NewServicePresenter(s models.Service) ServicePresenter {
	return ServicePresenter{
		ID:            s.ID,
		Name:          s.Name,
		Description:   s.Description,
		RequiresAuth:  s.RequiresAuth,
		OAuthProvider: s.OAuthProvider,
	}
}

type SubscriptionPresenter struct {
	ID        string    `json:"id"`
	ServiceID string    `json:"service_id"`
	CreatedAt time.Time `json:"created_at"`
}

func NewSubscriptionPresenter(r *usecases.SubscribeResult) SubscriptionPresenter {
	return SubscriptionPresenter{
		ID:        r.ID,
		ServiceID: r.ServiceID,
		CreatedAt: r.CreatedAt,
	}
}
