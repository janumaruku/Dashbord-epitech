package database

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/config"
)

func Connect() (*gorm.DB, error) {
	return gorm.Open(mysql.Open(config.MySQLDSN()), &gorm.Config{})
}
