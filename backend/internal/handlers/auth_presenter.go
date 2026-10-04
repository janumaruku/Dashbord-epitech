package handlers

import "github.com/janumaruku/Dashbord-epitech/backend/internal/models"

type UserPresenter struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func NewUserPresenter(u *models.User) UserPresenter {
	return UserPresenter{
		ID:       u.ID,
		Username: u.Username,
		Email:    u.Email,
	}
}

type AuthPresenter struct {
	Token        string        `json:"token"`
	RefreshToken string        `json:"refresh_token"`
	User         UserPresenter `json:"user"`
}

func NewAuthPresenter(token, refreshToken string, user *models.User) AuthPresenter {
	return AuthPresenter{
		Token:        token,
		RefreshToken: refreshToken,
		User:         NewUserPresenter(user),
	}
}

type RefreshPresenter struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
}
