package main

import (
	"fmt"
	"image/png"
	"os"

	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/qr"
)

func main() {
	var input string

	fmt.Println("Enter your string: ")
	fmt.Scanln(&input)

	qrCode, err := qr.Encode(input, qr.M, qr.Auto)

	if err != nil {
		panic(err)
	}

	qrCode, err = barcode.Scale(qrCode, 200, 200)

	if err != nil {
		panic(err)
	}

	file, err := os.Create("qrcode.png")
	defer file.Close()

	if err != nil {
		panic(err)
	}

	png.Encode(file, qrCode)
}
