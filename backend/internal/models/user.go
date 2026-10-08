package models

import (
	"errors"
	"net/http"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
)

var ErrUserNotFound = &dashborderrors.DashbordError{
	Code:    "USER_NOT_FOUND",
	Message: "User not found",
	Status:  http.StatusNotFound,
}

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
	if err := db.Create(user).Error; err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			return ErrDuplicateEntry
		}

		return err
	}

	return nil
}

func FindUserByEmail(db *gorm.DB, email string) (*User, error) {
	var user User

	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	return &user, nil
}
