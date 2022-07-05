package render

import (
	"net/http"
	"text/template"
)

type Page struct {
	Status      int
	Title       string
	Description string
	Error       string
	Template    string
}

func NewPage() *Page {
	return &Page{}
}

func (page *Page) SetMeta(title, description, template string, status int) *Page {
	page.Title = title
	page.Description = description
	page.Template = template
	page.Status = status

	return page
}

func (page *Page) AsHome() *Page {
	return page.SetMeta(
		"QR Code Generator",
		"A page to generate QR",
		"templates/index.html",
		http.StatusOK,
	)
}

func (page *Page) SetError(err error, status int) *Page {
	page.Error = err.Error()
	page.Status = status

	return page
}

func (page *Page) Write(w http.ResponseWriter) *Page {
	t, err := template.ParseFiles(page.Template)

	if err != nil {
		page.Status = http.StatusInternalServerError
		http.Error(w, err.Error(), page.Status)

		return page
	}

	w.WriteHeader(page.Status)
	t.Execute(w, page)

	return page
}
