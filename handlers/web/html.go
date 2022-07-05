package handlers

import (
	"net/http"

	render "github.com/joaomarcuslf/qr-generator/render"
	generator "github.com/joaomarcuslf/qr-generator/services/generators"
)

func Home(w http.ResponseWriter, r *http.Request) {
	render.NewPage().AsHome().Write(w)
}

func GenerateQr(w http.ResponseWriter, r *http.Request) {
	qr := generator.NewQRCode()

	err := qr.SetBarcode(r.FormValue("dataString")).ToPNG(w)

	if err != nil {
		render.NewPage().AsHome().SetError(err, http.StatusBadRequest).Write(w)
	}
}
