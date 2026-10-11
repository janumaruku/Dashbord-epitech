package external

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

const githubBaseURL = "https://api.github.com"

func FetchGithubWidget(oauthToken, widgetName string, config models.JSONMap) (models.JSONMap, error) {
	if oauthToken == "" {
		return nil, &FetchError{Message: "GitHub is not connected"}
	}

	switch widgetName {
	case "user_profile":
		username, _ := config["username"].(string)
		return fetchGithubUserProfile(oauthToken, username)
	case "recent_repos":
		username, _ := config["username"].(string)
		limit := intFromConfig(config, "limit", 5, 1, 10)
		return fetchGithubRecentRepos(oauthToken, username, limit)
	case "recent_commits":
		owner, _ := config["owner"].(string)
		repo, _ := config["repo"].(string)
		limit := intFromConfig(config, "limit", 10, 1, 20)
		return fetchGithubRecentCommits(oauthToken, owner, repo, limit)
	default:
		return nil, &FetchError{Message: "Unsupported GitHub widget"}
	}
}

func githubRequest(token, method, url string) (*http.Response, error) {
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "epitech-dashboard")
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	return httpClient.Do(req)
}

func githubStatusError(resp *http.Response) error {
	switch {
	case resp.StatusCode == http.StatusOK:
		return nil
	case resp.StatusCode == http.StatusUnauthorized:
		return &FetchError{Message: "GitHub token expired, reconnect your account"}
	case resp.StatusCode == http.StatusForbidden:
		if resp.Header.Get("X-RateLimit-Remaining") == "0" {
			return &FetchError{Message: "GitHub rate limited"}
		}
		return &FetchError{Message: "GitHub access forbidden, check your authorization"}
	case resp.StatusCode == http.StatusNotFound:
		return &FetchError{Message: "GitHub resource not found"}
	case resp.StatusCode == http.StatusTooManyRequests:
		return &FetchError{Message: "GitHub rate limited"}
	case resp.StatusCode >= http.StatusInternalServerError:
		return &FetchError{Message: "GitHub service is down"}
	default:
		return &FetchError{Message: "GitHub returned an unexpected error"}
	}
}

type githubUser struct {
	Login       string `json:"login"`
	Name        string `json:"name"`
	AvatarURL   string `json:"avatar_url"`
	Bio         string `json:"bio"`
	Followers   int    `json:"followers"`
	PublicRepos int    `json:"public_repos"`
}

func fetchGithubUserProfile(token, username string) (models.JSONMap, error) {
	if username == "" {
		return nil, &FetchError{Message: "GitHub username is required"}
	}

	resp, err := githubRequest(token, http.MethodGet, fmt.Sprintf("%s/users/%s", githubBaseURL, username))
	if err != nil {
		return nil, &FetchError{Message: "Could not reach GitHub"}
	}
	defer resp.Body.Close()

	if err := githubStatusError(resp); err != nil {
		return nil, err
	}

	var user githubUser
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, &FetchError{Message: "Could not read GitHub response"}
	}

	return models.JSONMap{
		"username":     user.Login,
		"name":         user.Name,
		"avatar_url":   user.AvatarURL,
		"bio":          user.Bio,
		"followers":    user.Followers,
		"public_repos": user.PublicRepos,
	}, nil
}

type githubRepo struct {
	Name            string  `json:"name"`
	Description     *string `json:"description"`
	Language        *string `json:"language"`
	StargazersCount int     `json:"stargazers_count"`
	HTMLURL         string  `json:"html_url"`
	UpdatedAt       string  `json:"updated_at"`
}

func fetchGithubRecentRepos(token, username string, limit int) (models.JSONMap, error) {
	if username == "" {
		return nil, &FetchError{Message: "GitHub username is required"}
	}

	url := fmt.Sprintf("%s/users/%s/repos?sort=updated&per_page=%d", githubBaseURL, username, limit)
	resp, err := githubRequest(token, http.MethodGet, url)
	if err != nil {
		return nil, &FetchError{Message: "Could not reach GitHub"}
	}
	defer resp.Body.Close()

	if err := githubStatusError(resp); err != nil {
		return nil, err
	}

	var repos []githubRepo
	if err := json.NewDecoder(resp.Body).Decode(&repos); err != nil {
		return nil, &FetchError{Message: "Could not read GitHub response"}
	}

	items := make([]models.JSONMap, 0, len(repos))
	for _, r := range repos {
		description := ""
		if r.Description != nil {
			description = *r.Description
		}
		language := ""
		if r.Language != nil {
			language = *r.Language
		}
		items = append(items, models.JSONMap{
			"name":        r.Name,
			"description": description,
			"language":    language,
			"stars":       r.StargazersCount,
			"url":         r.HTMLURL,
			"updated_at":  r.UpdatedAt,
		})
	}

	return models.JSONMap{"username": username, "repos": items}, nil
}

type githubCommit struct {
	SHA    string `json:"sha"`
	Commit struct {
		Message string `json:"message"`
		Author  struct {
			Name string `json:"name"`
			Date string `json:"date"`
		} `json:"author"`
	} `json:"commit"`
	Author *struct {
		Login string `json:"login"`
	} `json:"author"`
	HTMLURL string `json:"html_url"`
}

func fetchGithubRecentCommits(token, owner, repo string, limit int) (models.JSONMap, error) {
	if owner == "" || repo == "" {
		return nil, &FetchError{Message: "Repository owner and name are required"}
	}

	url := fmt.Sprintf("%s/repos/%s/%s/commits?per_page=%d", githubBaseURL, owner, repo, limit)
	resp, err := githubRequest(token, http.MethodGet, url)
	if err != nil {
		return nil, &FetchError{Message: "Could not reach GitHub"}
	}
	defer resp.Body.Close()

	if err := githubStatusError(resp); err != nil {
		return nil, err
	}

	var commits []githubCommit
	if err := json.NewDecoder(resp.Body).Decode(&commits); err != nil {
		return nil, &FetchError{Message: "Could not read GitHub response"}
	}

	items := make([]models.JSONMap, 0, len(commits))
	for _, c := range commits {
		author := c.Commit.Author.Name
		if c.Author != nil && c.Author.Login != "" {
			author = c.Author.Login
		}

		message := c.Commit.Message
		if idx := strings.IndexByte(message, '\n'); idx >= 0 {
			message = message[:idx]
		}

		shaLen := min(7, len(c.SHA))

		items = append(items, models.JSONMap{
			"sha":     c.SHA[:shaLen],
			"message": message,
			"author":  author,
			"date":    c.Commit.Author.Date,
			"url":     c.HTMLURL,
		})
	}

	return models.JSONMap{"owner": owner, "repo": repo, "commits": items}, nil
}
