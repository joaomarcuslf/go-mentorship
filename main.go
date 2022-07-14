package main

import (
	server "github.com/joaomarcuslf/qr-generator/server"
)

func main() {
	server := server.NewServer("8000")
	server.Run()
}
