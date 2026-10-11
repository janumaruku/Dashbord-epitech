package usecases

import (
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

func ListWidgetCatalog(db *gorm.DB) ([]models.Widget, error) {
	return models.ListWidgetsWithParams(db)
}
