package usecases

import (
	"net/http"
	"time"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

var ErrOAuthRequired = &dashborderrors.DashboardError{
	Code:    "OAUTH_REQUIRED",
	Message: "This service requires OAuth",
	Status:  http.StatusBadRequest,
}

var ErrAlreadySubscribed = &dashborderrors.DashboardError{
	Code:    "ALREADY_SUBSCRIBED",
	Message: "Already subscribed to this service",
	Status:  http.StatusConflict,
}

type SubscribeResult struct {
	ID        string
	ServiceID string
	CreatedAt time.Time
}

func Subscribe(db *gorm.DB, userID, serviceID string) (*SubscribeResult, error) {
	service, err := models.FindServiceByID(db, serviceID)
	if err != nil {
		return nil, err
	}

	if service.RequiresAuth {
		return nil, ErrOAuthRequired
	}

	alreadySubscribed, err := models.UserServiceExists(db, userID, serviceID)
	if err != nil {
		return nil, err
	}
	if alreadySubscribed {
		return nil, ErrAlreadySubscribed
	}

	us := models.UserService{
		UserID:    userID,
		ServiceID: serviceID,
	}

	if err := models.CreateUserService(db, &us); err != nil {
		return nil, err
	}

	return &SubscribeResult{ID: us.ID, ServiceID: us.ServiceID, CreatedAt: us.CreatedAt}, nil
}
