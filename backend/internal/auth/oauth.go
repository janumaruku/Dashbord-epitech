package auth

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/janumaruku/Dashbord-epitech/backend/config"
)

const githubTokenURL = "https://github.com/login/oauth/access_token"

var ErrGitHubExchangeFailed = errors.New("github token exchange failed")

type githubTokenResponse struct {
	AccessToken      string `json:"access_token"`
	Error            string `json:"error"`
	ErrorDescription string `json:"error_description"`
}

func ExchangeGitHubCode(code string) (string, error) {
	payload, err := json.Marshal(map[string]string{
		"client_id":     config.MustGetenv("GITHUB_CLIENT_ID"),
		"client_secret": config.MustGetenv("GITHUB_CLIENT_SECRET"),
		"code":          code,
		"redirect_uri":  config.MustGetenv("GITHUB_REDIRECT_URI"),
	})
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest(http.MethodPost, githubTokenURL, bytes.NewReader(payload))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var tokenResp githubTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return "", err
	}

	if tokenResp.Error != "" || tokenResp.AccessToken == "" {
		return "", fmt.Errorf("%w: %s", ErrGitHubExchangeFailed, tokenResp.ErrorDescription)
	}

	return tokenResp.AccessToken, nil
}
