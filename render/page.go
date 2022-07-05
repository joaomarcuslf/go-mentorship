package render

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
		"index.html",
		http.StatusOK,
	)
}

func (page *Page) SetError(err error, status int) *Page {
	page.Error = err.Error()
	page.Status = status

	return page
}

func (page *Page) Write(c *gin.Context) *Page {
	c.HTML(
		page.Status,
		page.Template,
		gin.H{
			"Title":       page.Title,
			"Description": page.Description,
			"Error":       page.Error,
		},
	)

	return page
}
