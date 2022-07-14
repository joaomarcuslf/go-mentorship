package server

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	database "github.com/joaomarcuslf/qr-generator/database"
	api "github.com/joaomarcuslf/qr-generator/handlers/api"
	web "github.com/joaomarcuslf/qr-generator/handlers/web"
)

type Server struct {
	Port string
}

func NewServer(port string) *Server {
	return &Server{
		Port: port,
	}
}

func (a *Server) Run() {
	database.NewDB()
	defer database.Close()

	router := gin.Default()
	router.Use(cors.Default())

	router.LoadHTMLGlob("templates/*")
	router.Static("/static", "./static")

	router.GET("/", web.Home)
	router.POST("/generator", web.GenerateQr)

	sc := api.NewSiteController()

	router.GET("/api/sites", sc.List)
	router.POST("/api/sites", sc.Create)
	router.GET("/api/sites/:id", sc.Show)
	router.PUT("/api/sites/:id", sc.Update)
	router.DELETE("/api/sites/:id", sc.Delete)

	router.Run(":" + a.Port)
}
