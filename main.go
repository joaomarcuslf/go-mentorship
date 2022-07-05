package main

import (
	server "github.com/joaomarcuslf/qr-generator/server"
)

func main() {
	// file, err := os.Create("qrcode.png")
	// defer file.Close()

	// if err != nil {
	// 	panic(err)
	// }

	// cli := io.NewCLI()
	// qr := generator.NewQRCode()

	// cli.Write("Enter your string: ")

	// qr.SetBarcode(cli.Read()).ToPNG(file)

	server := server.NewServer("8000")
	server.Run()
}
