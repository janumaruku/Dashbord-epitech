package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type WidgetData struct {
	ID               string     `gorm:"column:id;type:char(36);primaryKey"`
	WidgetInstanceID string     `gorm:"column:widget_instance_id;type:char(36);not null"`
	Data             JSONMap    `gorm:"column:data;type:json"`
	FetchedAt        time.Time  `gorm:"column:fetched_at"`
	ExpiresAt        *time.Time `gorm:"column:expires_at"`
}

func (WidgetData) TableName() string {
	return "widget_data"
}

func (wd *WidgetData) BeforeCreate(tx *gorm.DB) error {
	if wd.ID == "" {
		wd.ID = uuid.New().String()
	}

	return nil
}

func SaveWidgetData(db *gorm.DB, data *WidgetData) error {
	return db.Create(data).Error
}

func FindLatestWidgetData(db *gorm.DB, instanceID string) (*WidgetData, error) {
	var data WidgetData

	err := db.Where("widget_instance_id = ?", instanceID).
		Order("fetched_at DESC").
		First(&data).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return &data, nil
}
