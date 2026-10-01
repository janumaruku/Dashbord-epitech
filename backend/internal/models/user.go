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

func UsernameExists(db *gorm.DB, username string) (bool, error) {
	var count int64

	if err := db.Model(&User{}).Where("username = ?", username).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func EmailExists(db *gorm.DB, email string) (bool, error) {
	var count int64

	if err := db.Model(&User{}).Where("email = ?", email).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func CreateUser(db *gorm.DB, user *User) error {
	return db.Create(user).Error
}
