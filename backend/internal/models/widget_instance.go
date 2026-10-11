package models

import (
	"errors"
	"net/http"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
)

var ErrWidgetInstanceNotFound = &dashborderrors.DashboardError{
	Code:    "WIDGET_INSTANCE_NOT_FOUND",
	Message: "Widget instance not found",
	Status:  http.StatusNotFound,
}

type WidgetInstance struct {
	ID          string    `gorm:"column:id;type:char(36);primaryKey"`
	UserID      string    `gorm:"column:user_id;type:char(36);not null"`
	WidgetID    string    `gorm:"column:widget_id;type:char(36);not null"`
	Config      JSONMap   `gorm:"column:config;type:json;not null"`
	RefreshRate int       `gorm:"column:refresh_rate;not null"`
	Position    Position  `gorm:"column:position;type:json;not null"`
	CreatedAt   time.Time `gorm:"column:created_at"`
	UpdatedAt   time.Time `gorm:"column:updated_at"`
}

func (WidgetInstance) TableName() string {
	return "widget_instances"
}

func (wi *WidgetInstance) BeforeCreate(tx *gorm.DB) error {
	if wi.ID == "" {
		wi.ID = uuid.New().String()
	}

	return nil
}

func CreateWidgetInstance(db *gorm.DB, wi *WidgetInstance) error {
	return db.Create(wi).Error
}

func ListWidgetInstancesByUser(db *gorm.DB, userID string) ([]WidgetInstance, error) {
	var instances []WidgetInstance

	if err := db.Where("user_id = ?", userID).Find(&instances).Error; err != nil {
		return nil, err
	}

	return instances, nil
}

func FindWidgetInstanceByID(db *gorm.DB, id string) (*WidgetInstance, error) {
	var instance WidgetInstance

	if err := db.First(&instance, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrWidgetInstanceNotFound
		}

		return nil, err
	}

	return &instance, nil
}

func UpdateWidgetInstance(db *gorm.DB, wi *WidgetInstance) error {
	return db.Save(wi).Error
}

func DeleteWidgetInstance(db *gorm.DB, id string) error {
	return db.Delete(&WidgetInstance{}, "id = ?", id).Error
}
