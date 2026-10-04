package usecases

type DBError struct {
	Err error
}

func (e *DBError) Error() string {
	return e.Err.Error()
}

func (e *DBError) Unwrap() error {
	return e.Err
}

type InternalError struct {
	Err error
}

func (e *InternalError) Error() string {
	return e.Err.Error()
}

func (e *InternalError) Unwrap() error {
	return e.Err
}
