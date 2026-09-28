package main

import (
	"github.com/janumaruku/Dashbord-epitech/backend/internal/cli"
)

func main() {
	err := cli.Execute()
	if err != nil {
		return
	}
}
