package main

import (
	"github.com/janumaruku/Dashbord-epitech/backend/cmd"
)

func main() {
	err := cmd.Execute()
	if err != nil {
		return
	}
}
