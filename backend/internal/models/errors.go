package models

import (
	"net/http"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
)

var ErrDuplicateEntry = &dashborderrors.DashboardError{
	Code:    "DUPLICATE_ENTRY",
	Message: "This value already exists",
	Status:  http.StatusConflict,
}
