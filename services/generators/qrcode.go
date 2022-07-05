package services

import (
	"fmt"
	"image/png"
	"io"

	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/qr"
)

type QRCode struct {
	barcode *barcode.Barcode
	width   int
	height  int
}

func NewQRCode() *QRCode {
	return &QRCode{
		width:  200,
		height: 200,
	}
}

func (generator *QRCode) SetBarcode(input string) *QRCode {
	if input == "" {
		return generator
	}

	qrCode, err := qr.Encode(input, qr.M, qr.Auto)

	if err != nil {
		return generator
	}

	qrCode, err = barcode.Scale(qrCode, generator.width, generator.height)

	if err != nil {
		return generator
	}

	generator.barcode = &qrCode

	return generator
}

func (generator *QRCode) ToPNG(w io.Writer) error {
	if generator.barcode == nil {
		return fmt.Errorf("invalid input provided")
	}

	err := png.Encode(w, *generator.barcode)

	return err
}
