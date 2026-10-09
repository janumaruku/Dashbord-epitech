package models

import (
	"errors"
	"net/http"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
)

var ErrServiceNotFound = &dashborderrors.DashboardError{
	Code:    "SERVICE_NOT_FOUND",
	Message: "Service not found",
	Status:  http.StatusNotFound,
}

type Service struct {
	ID            string    `gorm:"column:id;type:char(36);primaryKey"`
	Name          string    `gorm:"column:name;size:50;unique;not null"`
	Description   string    `gorm:"column:description;size:255;not null"`
	RequiresAuth  bool      `gorm:"column:requires_auth;not null;default:false"`
	OAuthProvider *string   `gorm:"column:oauth_provider;size:255"`
	CreatedAt     time.Time `gorm:"column:created_at"`
	UpdatedAt     time.Time `gorm:"column:updated_at"`
}

func (s *Service) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}

	return nil
}

func ListServices(db *gorm.DB) ([]Service, error) {
	var services []Service

	if err := db.Find(&services).Error; err != nil {
		return nil, err
	}

	return services, nil
}

func FindServiceByID(db *gorm.DB, id string) (*Service, error) {
	var service Service

	if err := db.First(&service, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrServiceNotFound
		}

		return nil, err
	}

	return &service, nil
}
