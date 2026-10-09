package dashborderrors

import "net/http"

type DashboardError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Status  int    `json:"-"`
}

func (e *DashboardError) Error() string {
	return e.Message
}

func (e *DashboardError) Is(target error) bool {
	t, ok := target.(*DashboardError)
	if !ok {
		return false
	}

	return e.Code == t.Code
}

var ErrInternal = &DashboardError{
	Code:    "INTERNAL_SERVER_ERROR",
	Message: "Internal server error",
	Status:  http.StatusInternalServerError,
}

var ErrInvalidRequestBody = &DashboardError{
	Code:    "INVALID_REQUEST_BODY",
	Message: "Invalid request body",
	Status:  http.StatusBadRequest,
}
