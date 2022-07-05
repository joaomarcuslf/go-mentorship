# Golang Lessons

Este repositório tem o objetivo de ensinar os tópicos principais, e uma forma de aprender Go.

## Como usar

Vá nas Tags desse projeto, nelas estarão qual o número da aula, e dentro de cada aula o README.md será modificado para que você possa ver quais os objetivos da aula.

Se você quiser acompanhar desde o início, procure pela tag `lesson-00`, e mude o link no go.mod para ser seu nome no Github.

## O que você já deve saber

Esse repositório parte do princípio que você já fez o [download e instalou o Golang](https://go.dev/) em sua máquina, e que você fez o [tutorial da página do Go](https://go.dev/tour/welcome/1). Sendo assim, você deve estar minimamente ambientado com a sintaxe, e com os princípios da linguagem.

## Objetivo da aula:

### Adicionando o gerador

Vamos começar a adicionar nossa rota responsável por gerar os QR codes. Primeira coisa que precisamos fazer é criar um novo arquivo dentro de `handlers/web`.

```bash
touch handlers/web/generator.go
```

Abra o `web/generator.go`, e vamos começar a escrever nosso código. Você deve se lembrar dessa assinatura, certo?

```go
qr.SetBarcode(cli.Read()).ToPNG(file)
```

Bom, nós vamos substituir o `cli.Read()` pelo valor provido pelo nosso form, e o file pelo nosso writer de http.

> Não sabe o que isso significa? Abra [net/http#ResponseWriter](https://pkg.go.dev/net/http#ResponseWriter) para ver como a documentação funciona. Em resumo, nossa lib HTTP provê uma assinatura de writer que respeita a interface `io.Writer` que tanto falamos.

Vamos por parte, como vai funcionar:

```go
package handlers

import (
	"fmt"
	"net/http"

	generator "github.com/joaomarcuslf/qr-generator/services/generators"
)

func GenerateQr(w http.ResponseWriter, r *http.Request) {
	qr := generator.NewQRCode()

	qr.SetBarcode(cli.Read()).ToPNG(file)
}
```

No nosso caso `cli.Read()` será `r.FormValue("dataString")`, e `file` será `w`. Ficando assim o resultado final:

```go
package handlers

import (
	"fmt"
	"net/http"

	generator "github.com/joaomarcuslf/qr-generator/services/generators"
)

func GenerateQr(w http.ResponseWriter, r *http.Request) {
	qr := generator.NewQRCode()

	qr.SetBarcode(r.FormValue("dataString")).ToPNG(w)
}
```

Esse valor do dataString nós declaramos no nosso HTML na aula passada, dê uma olhada no HTML para ver como ele está sendo passado. Agora, como estamos trabalhando com um servidor, e é possível ter erros nos valores fornecidos pelo usuário, devemos também tratar os erros.

```go
package handlers

import (
	"fmt"
	"net/http"

	generator "github.com/joaomarcuslf/qr-generator/services/generators"
)

func GenerateQr(w http.ResponseWriter, r *http.Request) {
	qr := generator.NewQRCode()

	err := qr.SetBarcode(r.FormValue("dataString")).ToPNG(w)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)

		w.Write([]byte(fmt.Sprintf("error: %s", err)))

		return
	}
}
```

Agora vá em `services/generators/qrcode.go`, e atualize a função `SetBarcode` para que ela trate os erros.

```go
func (generator *QRCode) SetBarcode(input string) *QRCode {
	if input == "" {
		return generator
	}

  /* ... */
}

func (generator *QRCode) ToPNG(w io.Writer) error {
	if generator.barcode == nil {
		return fmt.Errorf("invalid input provided")
	}

  /* ... */
}
```

Agora vamos para nosso `http.go`, e adicionar nosso mais novo handler:

```go
func (a *Server) Run() {
	/* ... */

	http.HandleFunc("/", web.Home)
	http.HandleFunc("/generator", web.GenerateQr)

	/* ... */
}
```

Se você testar nosso código você vai ver que quando você coloca uma string válida, você será redirecionado para uma página com o QR code, porém se você enviar uma string vazia você verá uma página feia com um erro. Mas se você lembra, nós tinhamos um tratamento de erro para o form, por quê isso não funcionou?

Não funcionou por causa dessas linhas:

```go
if err != nil {
  w.WriteHeader(http.StatusBadRequest)

  w.Write([]byte(fmt.Sprintf("error: %s", err)))

  return
}
```

Nela nós estamos simplesmente escrevendo no corpo da resposta. Uma forma de corrigir isso seria:

```go
if err != nil {
  p := Page{
    Title:       "QR Code Generator",
    Description: "A page to generate QR",
    Error:       err.Error(),
  }

  t, err := template.ParseFiles("templates/index.html")

  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  w.WriteHeader(http.StatusBadRequest)
  t.Execute(w, p)
}
```

Porém um olhar mais atento percebeu que estamos repetindo o código de Render da Home, e isso é um pouco desnecessário. Vamos refatorar ambos os códigos para termos um código mais limpo.

```bash
mkdir render
touch render/page.go
```

Abra o `render/page.go`, e vamos começar a escrever nosso código.

```go
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
```

Vamos ver o uso prático desse código primeiro no nosso `web/html.go`:

```go
package handlers

import (
	"net/http"

	render "github.com/joaomarcuslf/qr-generator/render"
)

func Home(w http.ResponseWriter, r *http.Request) {
	render.NewPage().AsHome().Write(w)
}
```

Agora no nosso `web/generate.go`:

```go

import (
	"net/http"

	render "github.com/joaomarcuslf/qr-generator/render"
	generator "github.com/joaomarcuslf/qr-generator/services/generators"
)

func GenerateQr(w http.ResponseWriter, r *http.Request) {
	qr := generator.NewQRCode()

	err := qr.SetBarcode(r.FormValue("dataString")).ToPNG(w)

	if err != nil {
		render.NewPage().AsHome().SetError(err, http.StatusBadRequest).Write(w)
	}
}
```

Como o código ficou tão curto, ao invés de usarmos o `generator.go`, podemos mover a função para o `html.go`, pois esse arquivo é responsável pelo render de nossos HTMLs:

```go
package handlers

import (
	"net/http"

	render "github.com/joaomarcuslf/qr-generator/render"
	generator "github.com/joaomarcuslf/qr-generator/services/generators"
)

func Home(w http.ResponseWriter, r *http.Request) {
	render.NewPage().AsHome().Write(w)
}

func GenerateQr(w http.ResponseWriter, r *http.Request) {
	qr := generator.NewQRCode()

	err := qr.SetBarcode(r.FormValue("dataString")).ToPNG(w)

	if err != nil {
		render.NewPage().AsHome().SetError(err, http.StatusBadRequest).Write(w)
	}
}
```

Pronto, agora seu código está bem mais conciso e simples. Com isso nós concluimos essa nova parte. No próximo passo, vamos adicionar a lib [gin-gonic/gin](https://github.com/gin-gonic/gin), o que irá facilitar transformar essa aplicação em uma API.
