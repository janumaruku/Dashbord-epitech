package usecases

import (
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

func ListServices(db *gorm.DB) ([]models.Service, error) {
	return models.ListServices(db)
}
