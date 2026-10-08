package dashborderrors

import "net/http"

type DashbordError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Status  int    `json:"-"`
}

func (e *DashbordError) Error() string {
	return e.Message
}

func (e *DashbordError) Is(target error) bool {
	t, ok := target.(*DashbordError)
	if !ok {
		return false
	}

	return e.Code == t.Code
}

var ErrInternal = &DashbordError{
	Code:    "INTERNAL_SERVER_ERROR",
	Message: "Internal server error",
	Status:  http.StatusInternalServerError,
}

var ErrInvalidRequestBody = &DashbordError{
	Code:    "INVALID_REQUEST_BODY",
	Message: "Invalid request body",
	Status:  http.StatusBadRequest,
}
