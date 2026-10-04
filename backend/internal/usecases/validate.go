package usecases

import (
	"net/mail"
	"regexp"
	"unicode"
)

var usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_]{3,50}$`)

func validUsername(username string) bool {
	return usernameRegex.MatchString(username)
}

func validEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func validPassword(password string) bool {
	if len(password) < 8 {
		return false
	}

	var hasUpper, hasLower, hasDigit, hasSpecial bool

	for _, r := range password {
		switch {
		case unicode.IsUpper(r):
			hasUpper = true
		case unicode.IsLower(r):
			hasLower = true
		case unicode.IsDigit(r):
			hasDigit = true
		case !unicode.IsLetter(r) && !unicode.IsDigit(r):
			hasSpecial = true
		}
	}

	return hasUpper && hasLower && hasDigit && hasSpecial
}
