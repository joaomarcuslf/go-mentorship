package server

import (
	"net/http"

	web "github.com/joaomarcuslf/qr-generator/handlers/web"
	io "github.com/joaomarcuslf/qr-generator/services/io"
)

var cli *io.CLI = io.NewCLI()

type Server struct {
	Port string
}

func NewServer(port string) *Server {
	return &Server{
		Port: port,
	}
}

func (a *Server) Run() {
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", web.Home)

	cli.Write("Server running on port: " + a.Port)

	http.ListenAndServe(":"+a.Port, nil)
}
