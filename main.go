package main

import (
	"os"

	generator "github.com/joaomarcuslf/qr-generator/services/generators"
	io "github.com/joaomarcuslf/qr-generator/services/io"
)

func main() {
	file, err := os.Create("qrcode.png")
	defer file.Close()

	if err != nil {
		panic(err)
	}

	cli := io.NewCLI()
	qr := generator.NewQRCode()

	cli.Write("Enter your string: ")

	qr.SetBarcode(cli.Read()).ToPNG(file)
}
