package external

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"net/url"
	"sort"
	"strings"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

const weatherBaseURL = "https://api.openweathermap.org/data/2.5"

func FetchWeatherWidget(apiKey, widgetName string, config models.JSONMap) (models.JSONMap, error) {
	if apiKey == "" {
		return nil, &FetchError{Message: "Weather service is not configured"}
	}

	city, _ := config["city"].(string)
	units, _ := config["units"].(string)
	if units != "fahrenheit" {
		units = "celsius"
	}
	owmUnits := "metric"
	if units == "fahrenheit" {
		owmUnits = "imperial"
	}

	switch widgetName {
	case "city_temperature":
		return fetchCityTemperature(apiKey, city, owmUnits, units)
	case "current_conditions":
		return fetchCurrentConditions(apiKey, city, owmUnits, units)
	case "city_forecast":
		days := 5
		if d, ok := config["days"].(float64); ok && d >= 1 && d <= 5 {
			days = int(d)
		}
		return fetchCityForecast(apiKey, city, owmUnits, units, days)
	default:
		return nil, &FetchError{Message: "Unsupported weather widget"}
	}
}

type owmWeatherResponse struct {
	Coord struct {
		Lat float64 `json:"lat"`
		Lon float64 `json:"lon"`
	} `json:"coord"`
	Weather []struct {
		Description string `json:"description"`
	} `json:"weather"`
	Main struct {
		Temp     float64 `json:"temp"`
		Humidity int     `json:"humidity"`
		Pressure int     `json:"pressure"`
	} `json:"main"`
	Wind struct {
		Speed float64 `json:"speed"`
	} `json:"wind"`
	Name string `json:"name"`
}

func fetchCurrentWeather(apiKey, city, owmUnits string) (*owmWeatherResponse, error) {
	params := url.Values{"q": {city}, "appid": {apiKey}, "units": {owmUnits}}
	resp, err := httpClient.Get(weatherBaseURL + "/weather?" + params.Encode())
	if err != nil {
		return nil, &FetchError{Message: "Could not reach the weather service"}
	}
	defer resp.Body.Close()

	if err := weatherStatusError(resp.StatusCode); err != nil {
		return nil, err
	}

	var body owmWeatherResponse
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return nil, &FetchError{Message: "Could not read weather response"}
	}

	return &body, nil
}

func weatherStatusError(status int) error {
	switch {
	case status == http.StatusOK:
		return nil
	case status == http.StatusUnauthorized:
		return &FetchError{Message: "Weather API key is invalid"}
	case status == http.StatusNotFound:
		return &FetchError{Message: "City not found"}
	case status == http.StatusTooManyRequests:
		return &FetchError{Message: "Weather service rate limited"}
	case status >= http.StatusInternalServerError:
		return &FetchError{Message: "Weather service is down"}
	default:
		return &FetchError{Message: "Weather service returned an unexpected error"}
	}
}

func fetchCityTemperature(apiKey, city, owmUnits, unitsLabel string) (models.JSONMap, error) {
	data, err := fetchCurrentWeather(apiKey, city, owmUnits)
	if err != nil {
		return nil, err
	}

	condition := ""
	if len(data.Weather) > 0 {
		condition = capitalize(data.Weather[0].Description)
	}

	return models.JSONMap{
		"city":        data.Name,
		"temperature": roundTo1(data.Main.Temp),
		"units":       unitsLabel,
		"condition":   condition,
		"humidity":    data.Main.Humidity,
	}, nil
}

func fetchCurrentConditions(apiKey, city, owmUnits, unitsLabel string) (models.JSONMap, error) {
	data, err := fetchCurrentWeather(apiKey, city, owmUnits)
	if err != nil {
		return nil, err
	}

	windSpeed := data.Wind.Speed
	windUnits := "mph"
	if owmUnits == "metric" {
		windSpeed = windSpeed * 3.6
		windUnits = "km/h"
	}

	result := models.JSONMap{
		"city":       data.Name,
		"wind_speed": roundTo1(windSpeed),
		"wind_units": windUnits,
		"pressure":   data.Main.Pressure,
	}

	if uv, err := fetchUVIndex(apiKey, data.Coord.Lat, data.Coord.Lon); err == nil {
		result["uv_index"] = uv
	}

	return result, nil
}

func fetchUVIndex(apiKey string, lat, lon float64) (float64, error) {
	params := url.Values{
		"lat":   {fmt.Sprintf("%f", lat)},
		"lon":   {fmt.Sprintf("%f", lon)},
		"appid": {apiKey},
	}
	resp, err := httpClient.Get(weatherBaseURL + "/uvi?" + params.Encode())
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("uv index status %d", resp.StatusCode)
	}

	var body struct {
		Value float64 `json:"value"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return 0, err
	}

	return body.Value, nil
}

type owmForecastResponse struct {
	List []struct {
		DtTxt string `json:"dt_txt"`
		Main  struct {
			TempMin float64 `json:"temp_min"`
			TempMax float64 `json:"temp_max"`
		} `json:"main"`
		Weather []struct {
			Description string `json:"description"`
		} `json:"weather"`
	} `json:"list"`
	City struct {
		Name string `json:"name"`
	} `json:"city"`
}

func fetchCityForecast(apiKey, city, owmUnits, unitsLabel string, days int) (models.JSONMap, error) {
	params := url.Values{"q": {city}, "appid": {apiKey}, "units": {owmUnits}}
	resp, err := httpClient.Get(weatherBaseURL + "/forecast?" + params.Encode())
	if err != nil {
		return nil, &FetchError{Message: "Could not reach the weather service"}
	}
	defer resp.Body.Close()

	if err := weatherStatusError(resp.StatusCode); err != nil {
		return nil, err
	}

	var body owmForecastResponse
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return nil, &FetchError{Message: "Could not read weather response"}
	}

	type dayAgg struct {
		date      string
		min, max  float64
		condition string
		hasData   bool
	}

	order := []string{}
	byDate := map[string]*dayAgg{}

	for _, entry := range body.List {
		date := strings.SplitN(entry.DtTxt, " ", 2)[0]
		agg, ok := byDate[date]
		if !ok {
			agg = &dayAgg{date: date}
			byDate[date] = agg
			order = append(order, date)
		}
		if !agg.hasData || entry.Main.TempMin < agg.min {
			agg.min = entry.Main.TempMin
		}
		if !agg.hasData || entry.Main.TempMax > agg.max {
			agg.max = entry.Main.TempMax
		}
		if strings.Contains(entry.DtTxt, "12:00:00") && len(entry.Weather) > 0 {
			agg.condition = capitalize(entry.Weather[0].Description)
		}
		agg.hasData = true
	}

	sort.Strings(order)
	if len(order) > days {
		order = order[:days]
	}

	forecastDays := make([]models.JSONMap, 0, len(order))
	for _, date := range order {
		agg := byDate[date]
		forecastDays = append(forecastDays, models.JSONMap{
			"date":      agg.date,
			"high":      roundTo1(agg.max),
			"low":       roundTo1(agg.min),
			"condition": agg.condition,
		})
	}

	return models.JSONMap{
		"city":  body.City.Name,
		"units": unitsLabel,
		"days":  forecastDays,
	}, nil
}

func capitalize(s string) string {
	if s == "" {
		return s
	}
	return strings.ToUpper(s[:1]) + s[1:]
}

func roundTo1(v float64) float64 {
	return math.Round(v*10) / 10
}
