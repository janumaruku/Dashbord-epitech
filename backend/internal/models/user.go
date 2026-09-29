package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID           string `gorm:"type:char(36);primaryKey"`
	Username     string `gorm:"size:50;unique;not null"`
	Email        string `gorm:"size:255;unique;not null"`
	PasswordHash string `gorm:"size:255;not null" json:"-"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = uuid.New().String()
	}

	return nil
}
