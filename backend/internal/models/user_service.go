package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserService struct {
	ID                string `gorm:"type:char(36);primaryKey"`
	UserID            string `gorm:"type:char(36);not null"`
	ServiceID         string `gorm:"type:char(36);not null"`
	Credentials       []byte `gorm:"type:varbinary(512)"`
	OAuthToken        []byte `gorm:"type:varbinary(512)"`
	OAuthRefreshToken []byte `gorm:"type:varbinary(512)"`
	CreatedAt         time.Time
}

func (us *UserService) BeforeCreate(tx *gorm.DB) error {
	if us.ID == "" {
		us.ID = uuid.New().String()
	}

	return nil
}

func UserServiceExists(db *gorm.DB, userID, serviceID string) (bool, error) {
	var count int64

	if err := db.Model(&UserService{}).
		Where("user_id = ? AND service_id = ?", userID, serviceID).
		Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func CreateUserService(db *gorm.DB, us *UserService) error {
	return db.Create(us).Error
}
