package usecases

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
	"time"

	"gorm.io/gorm"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/dashborderrors"
	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

var ErrOAuthRequired = &dashborderrors.DashboardError{
	Code:    "OAUTH_REQUIRED",
	Message: "This service requires OAuth",
	Status:  http.StatusBadRequest,
}

var ErrAlreadySubscribed = &dashborderrors.DashboardError{
	Code:    "ALREADY_SUBSCRIBED",
	Message: "Already subscribed to this service",
	Status:  http.StatusConflict,
}

var ErrGithubCodeRequired = &dashborderrors.DashboardError{
	Code:    "GITHUB_CODE_REQUIRED",
	Message: "A GitHub authorization code is required to connect this service",
	Status:  http.StatusBadRequest,
}

var ErrGithubExchangeFailed = &dashborderrors.DashboardError{
	Code:    "GITHUB_EXCHANGE_FAILED",
	Message: "Could not complete GitHub authorization",
	Status:  http.StatusBadGateway,
}

type SubscribeResult struct {
	ID        string
	ServiceID string
	CreatedAt time.Time
}

type GithubOAuthConfig struct {
	ClientID     string
	ClientSecret string
	RedirectURI  string
}

func Subscribe(db *gorm.DB, userID, serviceID, code string, github GithubOAuthConfig) (*SubscribeResult, error) {
	service, err := models.FindServiceByID(db, serviceID)
	if err != nil {
		return nil, err
	}

	alreadySubscribed, err := models.UserServiceExists(db, userID, serviceID)
	if err != nil {
		return nil, err
	}
	if alreadySubscribed {
		return nil, ErrAlreadySubscribed
	}

	us := models.UserService{
		UserID:    userID,
		ServiceID: serviceID,
	}

	if service.RequiresAuth {
		if service.OAuthProvider == nil || *service.OAuthProvider != "github" {
			return nil, ErrOAuthRequired
		}

		if code == "" {
			return nil, ErrGithubCodeRequired
		}

		token, err := exchangeGithubCode(code, github)
		if err != nil {
			return nil, err
		}

		us.OAuthToken = []byte(token)
	}

	if err := models.CreateUserService(db, &us); err != nil {
		return nil, err
	}

	return &SubscribeResult{ID: us.ID, ServiceID: us.ServiceID, CreatedAt: us.CreatedAt}, nil
}

func exchangeGithubCode(code string, github GithubOAuthConfig) (string, error) {
	if github.ClientID == "" || github.ClientSecret == "" {
		return "", ErrGithubExchangeFailed
	}

	form := url.Values{
		"client_id":     {github.ClientID},
		"client_secret": {github.ClientSecret},
		"code":          {code},
		"redirect_uri":  {github.RedirectURI},
	}

	req, err := http.NewRequest(http.MethodPost, "https://github.com/login/oauth/access_token", strings.NewReader(form.Encode()))
	if err != nil {
		return "", ErrGithubExchangeFailed
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", ErrGithubExchangeFailed
	}
	defer resp.Body.Close()

	var body struct {
		AccessToken string `json:"access_token"`
		Error       string `json:"error"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return "", ErrGithubExchangeFailed
	}

	if body.AccessToken == "" {
		return "", ErrGithubExchangeFailed
	}

	return body.AccessToken, nil
}
