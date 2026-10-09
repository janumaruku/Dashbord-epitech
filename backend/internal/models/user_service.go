package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserService struct {
	ID                string    `gorm:"column:id;type:char(36);primaryKey"`
	UserID            string    `gorm:"column:user_id;type:char(36);not null"`
	ServiceID         string    `gorm:"column:service_id;type:char(36);not null"`
	Credentials       []byte    `gorm:"column:credentials;type:varbinary(512)"`
	OAuthToken        []byte    `gorm:"column:oauth_token;type:varbinary(512)"`
	OAuthRefreshToken []byte    `gorm:"column:oauth_refresh_token;type:varbinary(512)"`
	CreatedAt         time.Time `gorm:"column:created_at"`
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
	if err := db.Create(us).Error; err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			return ErrDuplicateEntry
		}

		return err
	}

	return nil
}
