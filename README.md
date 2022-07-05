# Golang Lessons

Este repositório tem o objetivo de ensinar os tópicos principais, e uma forma de aprender Go.

## Como usar

Vá nas Tags desse projeto, nelas estarão qual o número da aula, e dentro de cada aula o README.md será modificado para que você possa ver quais os objetivos da aula.

Se você quiser acompanhar desde o início, procure pela tag `lesson-00`, e mude o link no go.mod para ser seu nome no Github.

## O que você já deve saber

Esse repositório parte do princípio que você já fez o [download e instalou o Golang](https://go.dev/) em sua máquina, e que você fez o [tutorial da página do Go](https://go.dev/tour/welcome/1). Sendo assim, você deve estar minimamente ambientado com a sintaxe, e com os princípios da linguagem.

## Objetivo da aula:

### Executando servidor

Para criar nosso servidor, nós vamos utilizar a [Design Pattern Command](https://refactoring.guru/pt-br/design-patterns/command), uma design pattern comportamental que vai ser muito útil para quando nós quisermos rodar o servidor em Go routines.

Nessa primeira versão nós vamos usar a Lib principal de HTTP no Go, a [net/http](https://golang.org/pkg/net/http/). Comece rodando os seguintes comandos:

```bash
mkdir server
touch server/http.go
```

Abra o arquivo `http.go` e escreva o seguinte:

```go
package server

import (
	"fmt"
	"net/http"

	io "github.com/joaomarcuslf/qr-generator/services/io"
)

var cli *io.CLI = io.NewCLI()

type Server struct {
	Port string
}

func NewServer(port string) *Server {
	return &Server{
		Port: port,
	}
}

func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "OK")
}

func (a *Server) Run() {
	http.HandleFunc("/", Index)

	cli.Write("Server running on port: " + a.Port)

	http.ListenAndServe(":"+a.Port, nil)
}
```

Perceba que a função `Index` utiliza aquele mesmo padrão de writer recebendo um `io.Writer`. Se você quiser, você pode criar uma interface dentro do `io` que envolva o `Fprintf`, no momento será desnecessário pois logo vamos mudar essa função.

Agora abra o `main.go`, e vamos atualizar o arquivo para usarmos o nosso servidor:

```go
package main

import (
	server "github.com/joaomarcuslf/qr-generator/server"
)

func main() {
	server := server.NewServer("8000")
	server.Run()
}
```

Basta executar seu código com `go run main.go`, e abrir seu navegador em [http://localhost:8000/](http://localhost:8000/) para ver os resultados do seu código.

Para melhorar a organização, vamos separar nossos `handlers` em arquivos.

> Não sabe o que é handler? Se convenciona chamar de handler uma função de rota, que é responsável por tratar o request e responder.

```bash
mkdir handlers
mkdir handlers/web
touch handlers/web/html.go
```

Abra o arquivo `html.go` e escreva o seguinte:

```go
package handlers

import (
	"fmt"
	"net/http"
)

func Home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "OK")
}
```

Em seguida vamos atualizar o `http.go` para usar o nosso handler:

```go
import (
  /* ... */
	web "github.com/joaomarcuslf/qr-generator/handlers/web"
	/* ... */
)

/* ... */

func (a *Server) Run() {
	http.HandleFunc("/", web.Home)

  /* ... */
}
```

Você pode apagar a antiga função `Index`, e agora é só restartar nosso servidor, e nada deve ter mudado. Agora vamos começar a fazer nossos HTMLs, como essa aula não tem foco em HTML, eu vou só passar por cima, e explicar as partes que o Go entra.

```bash
mkdir static
touch static/main.css
```

Abra o `main.css` e preencha com o seguinte CSS:

```css
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css";

.is-purple, .is-purple.is-dark {
  background-color: #5f163a;
  color: #f7e8f0;
}

.is-purple.is-light {
  background-color: #f7e8f0;
  color: #551637;
}

button.is-purple {
  background-color: #5f163a;
  color: #f7e8f0;
  transition: background-color 0.2s ease 0s;
  transition: color 0.2s ease 0s;
}

button.is-purple:hover {
  background-color: #d5a6bd;
  color: #5f163a;
}
```

Em seguida, vamos criar os templates.

```bash
mkdir templates
touch templates/index.html
```

Abra o `index.html` e preencha com o seguinte HTML:

```html
<html>
<head>
  <title>{{.Title}}</title>
  <meta charset="utf-8" />
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=6.0">

  <meta name="description" content="{{.Description}}">
  <meta property="og:description_safe" content="{{.Description}}" />

  <link rel="stylesheet" type="text/css" href="/static/main.css" />
</head>

<body>
  <section class="hero is-purple is-light is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8-tablet is-7-desktop is-7-widescreen">
            <form action="/generator" method=post class="box">
              <div class="field">
                <label for="" class="label has-text-left">Please enter the string you want to QRCode.</label>

                <div class="control">
                  <input
                    {{if .Error}}
                      class="input is-danger"
                    {{else}}
                      class="input"
                    {{end}}
                    placeholder="e.g. www.google.com"
                    name="dataString" />
                </div>

                {{if .Error}}
                  <p class="help is-danger">{{.Error}}</p>
                {{end}}
              </div>

              <div class="field has-text-right">
                <button class="button is-purple is-rounded is-medium is-fullwidth">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</body>
</html>
```

Quero chamar atenção para alguns trechos do HTML:

```html
<title>{{.Title}}</title>

<meta name="description" content="{{.Description}}">
  <meta property="og:description_safe" content="{{.Description}}" />

{{if .Error}}
  class="input is-danger"
{{else}}
  class="input"
{{end}}

{{if .Error}}
  <p class="help is-danger">{{.Error}}</p>
{{end}}
```

Nesses trechos nós estamos utilizando três variáveis, `.Title`, `.Description` e `.Error`. Essas variáveis são enviadas pelo Go para o template, como se fossem lacunas. Vamos atualizar nosso `web/html.go`.

```go
package handlers

import (
	"net/http"
	"text/template"
)

type Page struct {
	Title       string
	Description string
	Error       string
}

func Home(w http.ResponseWriter, r *http.Request) {
	p := Page{
		Title:       "QR Code Generator",
		Description: "A page to generate QR",
	}

	t, err := template.ParseFiles("templates/index.html")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	t.Execute(w, p)
}
```

E vamos atualizar nosso `http.go`, pois agora nós utilizamos pastas estáticas, e precisamos dizer ao nosso servidor para olhar para elas.:

```go
/* ... */

func (a *Server) Run() {
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", web.Home)

  /* ... */
}
```

### Concluindo

Agora é só atualizar seu servidor, e abrir [http://localhost:8000/](http://localhost:8000/), você vai ver o nosso HTML. Por hora ele não funciona, e é o que vamos fazer na nossa próxima aula. Revise o que fizemos e brinque com o HTML, CSS. Entenda também as variáveis.

Na próxima aula, nós vamos implementar a rota `/generator`.

## Adicionais:

Se você estiver cansado de ficar atualizando seu servidor, você pode utilizar o [cosmtrek/air](https://github.com/cosmtrek/air), siga o guia de instalação.

Depois rode:

```bash
air init

air server --port 8000
```

Agora sempre que você salvar seu código, o air irá atualizar seu servidor. E se você utilizar VS Code, você pode criar uma forma de rodar o servidor direto no editor.

```bash
mkdir .vscode

touch .vscode/launch.json
```

Abra `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
          "command": "air server --port 8000",
          "name": "Live Reload Server",
          "request": "launch",
          "type": "node-terminal"
        },
        {
            "name": "Launch Package",
            "type": "go",
            "request": "launch",
            "mode": "auto",
            "program": "${workspaceFolder}"
        }
    ]
}
```

Agora é só abrir a Tab `Run and Debug` e clique em `Live Reload Server`. Prontinho, agora você não precisará rodar tantos comandos para atualizar seu servidor.
