package usecases

import (
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

type ServiceWithStatus struct {
	Service    models.Service
	Subscribed bool
}

func ListServices(db *gorm.DB, userID string) ([]ServiceWithStatus, error) {
	services, err := models.ListServices(db)
	if err != nil {
		return nil, err
	}

	subscribedIDs, err := models.ListSubscribedServiceIDs(db, userID)
	if err != nil {
		return nil, err
	}

	subscribedSet := make(map[string]bool, len(subscribedIDs))
	for _, id := range subscribedIDs {
		subscribedSet[id] = true
	}

	result := make([]ServiceWithStatus, 0, len(services))
	for _, s := range services {
		result = append(result, ServiceWithStatus{
			Service:    s,
			Subscribed: subscribedSet[s.ID],
		})
	}

	return result, nil
}
