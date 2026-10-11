package external

import (
	"encoding/xml"
	"net/http"
	"strings"

	"github.com/janumaruku/Dashbord-epitech/backend/internal/models"
)

type rssFeed struct {
	Channel struct {
		Title       string `xml:"title"`
		Description string `xml:"description"`
		Items       []struct {
			Title   string `xml:"title"`
			Link    string `xml:"link"`
			PubDate string `xml:"pubDate"`
		} `xml:"item"`
	} `xml:"channel"`
}

func FetchRSSWidget(widgetName string, config models.JSONMap) (models.JSONMap, error) {
	feedURL, _ := config["feed_url"].(string)
	if feedURL == "" {
		return nil, &FetchError{Message: "Feed URL is required"}
	}
	if !strings.HasPrefix(feedURL, "https://") {
		return nil, &FetchError{Message: "Feed URL must use https://"}
	}

	switch widgetName {
	case "feed_latest":
		limit := intFromConfig(config, "limit", 10, 1, 20)
		return fetchFeedLatest(feedURL, limit)
	case "feed_summary":
		return fetchFeedSummary(feedURL)
	default:
		return nil, &FetchError{Message: "Unsupported RSS widget"}
	}
}

func fetchRSSFeed(feedURL string) (*rssFeed, error) {
	req, err := http.NewRequest(http.MethodGet, feedURL, nil)
	if err != nil {
		return nil, &FetchError{Message: "Invalid feed URL"}
	}
	req.Header.Set("User-Agent", "epitech-dashboard/1.0")
	req.Header.Set("Accept", "application/rss+xml, application/xml, text/xml")

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, &FetchError{Message: "Could not reach the feed"}
	}
	defer resp.Body.Close()

	switch {
	case resp.StatusCode == http.StatusOK:
	case resp.StatusCode == http.StatusNotFound:
		return nil, &FetchError{Message: "Invalid feed URL"}
	case resp.StatusCode >= http.StatusInternalServerError:
		return nil, &FetchError{Message: "Feed host is down"}
	default:
		return nil, &FetchError{Message: "Feed returned an unexpected error"}
	}

	var feed rssFeed
	if err := xml.NewDecoder(resp.Body).Decode(&feed); err != nil {
		return nil, &FetchError{Message: "Could not read feed, malformed XML"}
	}

	return &feed, nil
}

func fetchFeedLatest(feedURL string, limit int) (models.JSONMap, error) {
	feed, err := fetchRSSFeed(feedURL)
	if err != nil {
		return nil, err
	}

	items := feed.Channel.Items
	if len(items) > limit {
		items = items[:limit]
	}

	articles := make([]models.JSONMap, 0, len(items))
	for _, item := range items {
		articles = append(articles, models.JSONMap{
			"title":    item.Title,
			"link":     item.Link,
			"pub_date": item.PubDate,
		})
	}

	return models.JSONMap{
		"feed_title": feed.Channel.Title,
		"articles":   articles,
	}, nil
}

func fetchFeedSummary(feedURL string) (models.JSONMap, error) {
	feed, err := fetchRSSFeed(feedURL)
	if err != nil {
		return nil, err
	}

	return models.JSONMap{
		"title":         feed.Channel.Title,
		"description":   feed.Channel.Description,
		"article_count": len(feed.Channel.Items),
	}, nil
}
