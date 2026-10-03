package usecases

import (
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

// ListServices implements UC3: return every available service.
func ListServices(db *gorm.DB) ([]models.Service, error) {
	services, err := models.ListServices(db)
	if err != nil {
		return nil, &DBError{Err: err}
	}

	return services, nil
}
