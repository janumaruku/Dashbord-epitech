package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type JSONMap map[string]any

func (m JSONMap) Value() (driver.Value, error) {
	if m == nil {
		return "{}", nil
	}

	return json.Marshal(m)
}

func (m *JSONMap) Scan(value any) error {
	if value == nil {
		*m = JSONMap{}
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		s, ok := value.(string)
		if !ok {
			return errors.New("unsupported type for JSONMap")
		}
		bytes = []byte(s)
	}

	return json.Unmarshal(bytes, m)
}

type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
	W int `json:"w"`
	H int `json:"h"`
}

func (p Position) Value() (driver.Value, error) {
	return json.Marshal(p)
}

func (p *Position) Scan(value any) error {
	if value == nil {
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		s, ok := value.(string)
		if !ok {
			return errors.New("unsupported type for Position")
		}
		bytes = []byte(s)
	}

	return json.Unmarshal(bytes, p)
}
