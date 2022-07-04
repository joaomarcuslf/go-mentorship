# Golang Lessons

Este repositório tem o objetivo de ensinar os tópicos principais, e uma forma de aprender Go.

## Como usar

Vá nas Tags desse projeto, nelas estarão qual o número da aula, e dentro de cada aula o README.md será modificado para que você possa ver quais os objetivos da aula.

Se você quiser acompanhar desde o início, procure pela tag `lesson-00`, e mude o link no go.mod para ser seu nome no Github.

## O que você já deve saber

Esse repositório parte do princípio que você já fez o [download e instalou o Golang](https://go.dev/) em sua máquina, e que você fez o [tutorial da página do Go](https://go.dev/tour/welcome/1). Sendo assim, você deve estar minimamente ambientado com a sintaxe, e com os princípios da linguagem.

## Objetivo da aula:

### Primeiros passos

Vamos começar criando o nosso `main.go`, que será o nosso arquivo de entrada.

```bash
touch main.go
```

```go
package main

import (
    "fmt"
)

func main() {
    fmt.Println("Hello, world!")
}
```

O `main.go` como você já deve saber, é o arquivo principal de todo projeto em Go, ele inicia a execução do programa. Porém, como o Go é baseado em pacotes, temos que declarar o pacote `main` e logo depois importamos o pacote `fmt` para que possamos usar o mostrar como output do terminal uma mensagem.

Você pode ver seu código funcionando com:

```bash
go run main.go
```

Agora, com isso, nós escrevemos nosso primeiro programa, e ainda que básico, será o nossa base para nossas próximas aulas, e no fim, você irá se surpreender com como ele vai ficar.

### Adicionando Barcode

Vamos desenvolver essa sessão utilizando a lib mais importante desse projeto: [boombuler/barcode](github.com/boombuler/barcode).

Com essa lib nós iremos criar QR codes com base em uma [string](https://pkg.go.dev/strings) provida pelo usuário.

Para começar, vamos instalar a lib com:

```bash
go get github.com/boombuler/barcode
```

E para você importar a lib no nosso `main.go`, mude o import para seguir esse modelo:

```go
import (
    "image/png"
	"os"

	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/qr"
)
```

Se você estiver usando vscode, você pode clicar com `Option + Click`, ou `Alt + Click` para entender o que cada um dessas libs fazem, e como usar cada uma delas. Não é o propósito desse tutorial.

Depois de atualizar os imports, vamos para a função `func main()`, limpe o conteúdo dela, e vamos escrever parte por parte.

```go
input := "Hello, world!"

qrCode, err := qr.Encode(input, qr.M, qr.Auto)
```

Temos um `input`, que é a string que queremos que o QR code seja gerado, e um `err`, que é um possível erro que ocorreu ao gerar o QR code. Um padrão para lidar com erros no Go é com essa estrutura simples:

```go
if err != nil {
    panic(err)
}
```

Caso não tenha erro, nossa variável `qrCode` será gerada corretamente, porém precisamos definir uma dimensão para ela, para isso, vamos usar a função `barcode.Scale` que irá definir a dimensão do QR code de acordo com a string que foi passada.

```go
qrCode, err = barcode.Scale(qrCode, 200, 200)
```

A linha anterior sobreescreveu os valores de `qrCode` com a nova dimensão, e `err`. Como essa função também pode causar um erro, você dever repetir o `if` anterior que fizemos (sim, essa estrutura será repetida muitas vezes em um código).

A partir de agora, sempre que você vir um `err`, parta do princípio que você deve colocar um `if` para tratar o erro, eu só irei comentar quando ou o tratamento for diferente de um panic, ou não precisar ter nenhum.

Beleza, com isso, vamos criar um arquivo para sarvar nosso QR code, e vamos salvar ele como `qr.png`:

```go
file, err := os.Create("qrcode.png")
defer file.Close()
```

`defer` é uma palavra chave que é utilizada para que o código seja executado no final do código, ou seja, depois que o código foi executado.

Agora, é só salvar o arquivo:

```go
png.Encode(file, qrCode)
```

Esse padrão que o `Encode` está utilizando, onde nós passamos como primeiro local/arquivo que siga uma interface `io.Writer` como parâmetro, e segundo argumento o que queremos escrever, é muito comum no Go, e sempre que ela se repetir eu irei comentar sobre.

Vamos ver se o código funcionou:

```bash
go run main.go
```

Com o fim desse código, você devve ver um arquivo `qrcode.png`, e se você ler o arquivo, você vai ver um QR code com a string que você passou.

### Recebendo input do usuário

Bom, é bem sem graça você ter uma string estática sempre, então nós vamos receber input do usuário.

Você precisará atualizar os imports, e modificar a lina que você declarou o `input` para:

```go
import (
    "fmt"
    /* ... */
)

func main() {
	var input string

	fmt.Println("Enter your string: ")
	fmt.Scanln(&input)

    /* ... */
}
```

Vamos ver se o código funcionou:

```bash
go run main.go
```

### Concluindo

Bom, seu código já está funcionando, e você consegue facilmente gerar um QR code com a string que você passou. Nas próximas aulas nós vamos refatorar nosso código para que nossa `main()` fique mais limpa.


## Adicionais:

- [GoLang: Tipos de dados](https://golang.org/ref/spec#Types)
- [GoLang: Operadores](https://golang.org/ref/spec#Operators)
- [GoLang: Expressões](https://golang.org/ref/spec#Expressions)
- [Extensão Golang vscode](https://marketplace.visualstudio.com/items?itemName=golang.Go)

Se, você estiver usando, e é recomendado que estja, utilizando Git, não se esqueça de atualizar o seu `.gitignore`, e colocar lá dentro a seguinte linha:

```
qrcode.png
```