package database

import (
	"encoding/json"
	"fmt"
	"math/rand"

	json_reader "github.com/joaomarcuslf/qr-generator/services/readers"
)

type Site struct {
	URL string `json:"url"`
	Id  string `json:"id"`
}

type DB struct {
	Sites []Site
}

var instance *DB
var file string = "./db.json"

func NewDB() *DB {
	if instance == nil {
		byteValue, err := json_reader.Read(file)

		if err != nil {
			panic(err)
		}

		var db DB

		json.Unmarshal(byteValue, &db)

		instance = &db
	}

	return instance
}

func Close() {
	fmt.Println("closing database")
	if instance != nil {
		fmt.Println("Creating database file")
		json_reader.Save(file, instance)
	}
}

func (db *DB) Save() {
	if instance != nil {
		json_reader.Save(file, instance)
	}
}

func (db *DB) Add(url string) {
	min := 10
	max := 9999

	id := fmt.Sprintf("%d", rand.Intn(max-min)+min)

	db.Sites = append(db.Sites, Site{
		URL: url,
		Id:  id,
	})

	db.Save()
}

func (db *DB) Get(id string) (Site, error) {
	for _, site := range db.Sites {
		if site.Id == id {
			return site, nil
		}
	}

	return Site{}, fmt.Errorf("no site found, with id: %s", id)
}

func (db *DB) GetAll() []Site {
	return db.Sites
}

func (db *DB) Update(id, url string) {
	for i, site := range db.Sites {
		if site.Id == id {
			db.Sites[i].URL = url
		}
	}

	db.Save()
}

func (db *DB) Remove(id string) {
	for i, site := range db.Sites {
		if site.Id == id {
			db.Sites = append(db.Sites[:i], db.Sites[i+1:]...)
			return
		}
	}

	db.Save()
}
