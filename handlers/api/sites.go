package handlers

import (
	"github.com/gin-gonic/gin"
	database "github.com/joaomarcuslf/qr-generator/database"
)

type SiteController struct {
	db *database.DB
}

func NewSiteController() *SiteController {
	return &SiteController{
		db: database.NewDB(),
	}
}

func (sc *SiteController) List(c *gin.Context) {
	c.JSON(200, gin.H{
		"sites": sc.db.GetAll(),
	})
}

func (sc *SiteController) Create(c *gin.Context) {
	site := &database.Site{}
	c.BindJSON(site)

	sc.db.Add(site.URL)

	c.JSON(204, gin.H{})
}

func (sc *SiteController) Show(c *gin.Context) {
	id := c.Param("id")

	site, err := sc.db.Get(id)

	if err != nil {
		c.JSON(404, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"site": site,
	})
}

func (sc *SiteController) Update(c *gin.Context) {
	id := c.Param("id")

	var site database.Site

	c.BindJSON(&site)

	sc.db.Update(id, site.URL)

	c.JSON(204, gin.H{})
}

func (sc *SiteController) Delete(c *gin.Context) {
	id := c.Param("id")

	sc.db.Remove(id)

	c.JSON(200, gin.H{
		"message": "Site deleted",
	})
}
