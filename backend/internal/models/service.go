package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

var ErrServiceNotFound = errors.New("service not found")

type Service struct {
	ID            string  `gorm:"type:char(36);primaryKey"`
	Name          string  `gorm:"size:50;unique;not null"`
	Description   string  `gorm:"size:255;not null"`
	RequiresAuth  bool    `gorm:"not null;default:false"`
	OAuthProvider *string `gorm:"size:255"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
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
