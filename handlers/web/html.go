package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	database "github.com/joaomarcuslf/qr-generator/database"
	render "github.com/joaomarcuslf/qr-generator/render"
	generator "github.com/joaomarcuslf/qr-generator/services/generators"
)

var db *database.DB = database.NewDB()

func Home(c *gin.Context) {
	render.NewPage().AsHome().Write(c)
}

func GenerateQr(c *gin.Context) {
	qr := generator.NewQRCode()

	input := c.PostForm("dataString")

	db.Add(input)

	err := qr.SetBarcode(input).ToPNG(c.Writer)

	if err != nil {
		render.NewPage().AsHome().SetError(err, http.StatusBadRequest).Write(c)
	}
}
