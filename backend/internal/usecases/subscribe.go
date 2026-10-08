package usecases

import (
	"errors"
	"time"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

var (
	ErrServiceNotFound   = errors.New("service not found")
	ErrOAuthRequired     = errors.New("service requires oauth")
	ErrAlreadySubscribed = errors.New("already subscribed to this service")
)

type SubscribeResult struct {
	ID        string
	ServiceID string
	CreatedAt time.Time
}

func Subscribe(db *gorm.DB, userID, serviceID string) (*SubscribeResult, error) {
	service, err := models.FindServiceByID(db, serviceID)
	if err != nil {
		if errors.Is(err, models.ErrServiceNotFound) {
			return nil, ErrServiceNotFound
		}

		return nil, &DBError{Err: err}
	}

	if service.RequiresAuth {
		return nil, ErrOAuthRequired
	}

	alreadySubscribed, err := models.UserServiceExists(db, userID, serviceID)
	if err != nil {
		return nil, &DBError{Err: err}
	}
	if alreadySubscribed {
		return nil, ErrAlreadySubscribed
	}

	us := models.UserService{
		UserID:    userID,
		ServiceID: serviceID,
	}

	if err := models.CreateUserService(db, &us); err != nil {
		return nil, &DBError{Err: err}
	}

	return &SubscribeResult{ID: us.ID, ServiceID: us.ServiceID, CreatedAt: us.CreatedAt}, nil
}
