package services

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

func Read(path string) ([]byte, error) {
	jsonFile, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer jsonFile.Close()

	byteValue, err := ioutil.ReadAll(jsonFile)

	return byteValue, err
}

func Save(path string, data interface{}) {
	file, err := json.MarshalIndent(data, "", " ")

	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile(path, file, 0644)

	if err != nil {
		panic(err)
	}
}
