package handlers

import "github.com/janumaruku/Dashbord-epitech/backend/internal/models"

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
