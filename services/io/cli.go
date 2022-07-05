package services

import "fmt"

type CLI struct{}

func NewCLI() *CLI {
	return &CLI{}
}

func (io *CLI) Read() string {
	var input string
	fmt.Scanln(&input)

	return input
}

func (io *CLI) Write(output string) {
	fmt.Println(output)
}
