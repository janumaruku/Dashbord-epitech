package handlers

import (
	"net/mail"
	"regexp"
	"unicode"
)

var usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_]{3,50}$`)

// validUsername implements RG1: 3-50 alphanumeric/underscore characters.
func validUsername(username string) bool {
	return usernameRegex.MatchString(username)
}

// validEmail implements RG2. net/mail.ParseAddress is used instead of a
// hand-rolled regex — RFC 5322 email syntax is notoriously hard to match
// correctly with regex alone, and the standard library already does it.
func validEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

// validPassword implements RG3: 8+ characters, at least one uppercase,
// one lowercase, one digit, and one special character.
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
