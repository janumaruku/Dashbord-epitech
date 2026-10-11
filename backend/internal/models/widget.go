package models

import (
	"errors"
	"net/http"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
)

var ErrWidgetNotFound = &dashborderrors.DashboardError{
	Code:    "WIDGET_NOT_FOUND",
	Message: "Widget not found",
	Status:  http.StatusNotFound,
}

type Widget struct {
	ID          string        `gorm:"column:id;type:char(36);primaryKey"`
	ServiceID   string        `gorm:"column:service_id;type:char(36);not null"`
	Name        string        `gorm:"column:name;size:100;not null"`
	Description string        `gorm:"column:description;not null"`
	CreatedAt   time.Time     `gorm:"column:created_at"`
	Params      []WidgetParam `gorm:"foreignKey:WidgetID"`
}

func (Widget) TableName() string {
	return "widgets"
}

func (w *Widget) BeforeCreate(tx *gorm.DB) error {
	if w.ID == "" {
		w.ID = uuid.New().String()
	}

	return nil
}

type WidgetParam struct {
	ID          string `gorm:"column:id;type:char(36);primaryKey"`
	WidgetID    string `gorm:"column:widget_id;type:char(36);not null"`
	Name        string `gorm:"column:name;size:100;not null"`
	Type        string `gorm:"column:type;size:50;not null"`
	Description string `gorm:"column:description;not null"`
}

func (WidgetParam) TableName() string {
	return "widget_params"
}

func (p *WidgetParam) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}

	return nil
}

func ListWidgetsWithParams(db *gorm.DB) ([]Widget, error) {
	var widgets []Widget

	if err := db.Preload("Params").Find(&widgets).Error; err != nil {
		return nil, err
	}

	return widgets, nil
}

func FindWidgetByID(db *gorm.DB, id string) (*Widget, error) {
	var widget Widget

	if err := db.Preload("Params").First(&widget, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrWidgetNotFound
		}

		return nil, err
	}

	return &widget, nil
}
