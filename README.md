# Golang Lessons

Este repositório tem o objetivo de ensinar os tópicos principais, e uma forma de aprender Go.

## Como usar

Vá nas Tags desse projeto, nelas estarão qual o número da aula, e dentro de cada aula o README.md será modificado para que você possa ver quais os objetivos da aula.

Se você quiser acompanhar desde o início, procure pela tag `lesson-00`, e mude o link no go.mod para ser seu nome no Github.

## O que você já deve saber

Esse repositório parte do princípio que você já fez o [download e instalou o Golang](https://go.dev/) em sua máquina, e que você fez o [tutorial da página do Go](https://go.dev/tour/welcome/1). Sendo assim, você deve estar minimamente ambientado com a sintaxe, e com os princípios da linguagem.

## Objetivo da aula:

### Recapitulando

Na aula anterior, nós criamos um código que recebia do usuário uma string, e criava um QR Code, porém nós deixamos nossa `main()` muito poluída, na nossa aula de hoje nós vamos criar refatorar nosso código seguindo a filosofia de manter o código mais limpo, e seguindo princípio de responsabilidade única.

Vamos começar criando nossas pastas:

```bash
mkdir services

mkdir services/generators
touch services/generators/qrcode.go

mkdir services/io
touch services/io/cli.go
```

### Lidando com IO

Vamos trabalhar no aqruivo `touch services/io/cli.go`. A responsabilidade desse serviço será cuidar do IO da aplicação, apesar de óbvio, isso pode significar que ele será um logger em arquivo, um logger em CLI, ou qualquer outro tipo de log. Nessa aplicação por ser simples, ele irá ser um log em CLI, vamos começar a escrever nosso código.

Não podemos, esquecer dos imports, e declaração do pacote.

```go
package services

import "fmt"
```

Agora, talvez você não conheça esse tipo de declaração, mas se você está habituado com [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming), você irá pegar rápido, mas basicamente nós iremos definir uma Struct, e dizer algumas funções que ela terá.

```go
type CLI struct{}

func NewCLI() *CLI {
	return &CLI{}
}
```

Começamos declarando, o `Read`, que irá ler o input do usuário.

```go
func (io *CLI) Read() string {
	var input string
	fmt.Scanln(&input)

	return input
}
```

E agora, o `Write`, que irá escrever o output para o usuário.

```go
func (io *CLI) Write(output string) {
	fmt.Println(output)
}
```

### Criando um QR Code

Vamos trabalhar no aqruivo `touch services/generators/qrcode.go`.

Vamos seguir mais ou menos a mesma ideia do IO.

```go
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
```

Agora vamos declarar dois métodos, `SetBarcode`, e `ToPNG`.

A ideia, do `SetBarcode`, é utilizando nossa struct armazenar o Barcode, e facilitar a escrita desse barcode eventualmente num PNG, ou em qualquer outro formato.

```go
func (generator *QRCode) SetBarcode(input string) *QRCode {
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
```

Já o `ToPNG`, ele irá escrever o PNG dado um IO Writer.

```go
func (generator *QRCode) ToPNG(w io.Writer) error {
	if generator.barcode == nil {
		return fmt.Errorf("barcode is nil")
	}

	err := png.Encode(w, *generator.barcode)

	return err
}
```

Vamos ver na prática como vai ficar nosso `main.go`:

```go
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
```

### Concluindo

Nessa aula nós só refatoramos o código, na próxima nós vamos adicionar um servidor HTTP, e vamos mudar os inputs, e outputs para algo mais interessante.
