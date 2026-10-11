package external

type FetchError struct {
	Message string
}

func (e *FetchError) Error() string {
	return e.Message
}
