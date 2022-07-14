# Golang Lessons

Este repositório tem o objetivo de ensinar os tópicos principais, e uma forma de aprender Go.

## Como usar

Vá nas Tags desse projeto, nelas estarão qual o número da aula, e dentro de cada aula o README.md será modificado para que você possa ver quais os objetivos da aula.

Se você quiser acompanhar desde o início, procure pela tag `lesson-00`, e mude o link no go.mod para ser seu nome no Github.

## O que você já deve saber

Esse repositório parte do princípio que você já fez o [download e instalou o Golang](https://go.dev/) em sua máquina, e que você fez o [tutorial da página do Go](https://go.dev/tour/welcome/1). Sendo assim, você deve estar minimamente ambientado com a sintaxe, e com os princípios da linguagem.

## Objetivo da aula:

### Expectativas

Nessa aula vamos colocar React para rodar junto ao nosso projeto, e iremos adaptar nossa API para que ela seja consumida pelo nosso Front-end em React.

### O que você precisa?

Você vai precisar ter NodeJS instalado, eu estou utilizando a versão `v17.0.1`, porém consulte a página dos módulos que utilizarmos para verificar compatibilidade. E também estou utilizando o `yarn` para rodar os comandos.

### Criando nosso projeto

Abra um terminal dentro do nosso projeto, e rode:

```bash
yarn create react-app  qr-generator
```

O comando irá demorar um pouco para rodar, enquanto isso vamos preparar outros aquivos.

#### Rodando com o VSCode

Se você seguiu o tutorial inteiro, você deve estar rodando o projeto pelo VSCode, e agora nós podemos rodar em paralelo tanto o Front-end quando o Back-end. Abra o `.vscode/launch.json`, e modifique ela para ficar assim.

```json
{
    "version": "0.2.0",
    "compounds": [
      {
        "name": "Launch Full Application",
        "configurations": ["Launch Application (Go)", "Launch Application (Node)"],
        "stopAll": true
      }
    ],
    "configurations": [
      {
        "name": "Launch Application (Node)",
        "command": "npm start",
        "request": "launch",
        "type": "node-terminal",
      },
      {
        "name": "Launch Application (Go)",
        "command": "air server --port 8000",
        "request": "launch",
        "type": "node-terminal"
      }
    ]
}
```

Com isso na aba `Run and Debug`, você verá a opção de rodar com `Launch Full Application`, isso conclui essa etapa.

#### Atualizando o Air

Abra o `.air.toml`, e vamos adicionar os arquivos de Front-end para ele ignorar quando tiverem atualizações.

```toml
[build]
  /* ... */
  exclude_dir = ["static", "tmp", "vendor", "testdata", "node_modules", "src"]
  /* ... */
```

Você também deve atualizar o `.gitignore`:

```bash
qrcode.png
tmp/*
db.json
/node_modules
.pnp*
/coverage
/build
.env.*
*-debug.log*
```

#### Copiando arquivos

Até aqui, o `yarn create` já deve ter terminado, e sim, vamos copiar os arquivos de dentro dessa past para a raiz do projeto.

```bash
mv ./qr-generator/public ./
mv ./qr-generator/node_modules ./
mv ./qr-generator/package.json ./

mkdir src

mv ./qr-generator/src/setupTest.js ./src/setupTest.js

rm -rf ./qr-generator/
```

Com isso seu projeto já deve estar pronto, vá para próxima seção e vamos começar a preencher nosso código.

### Fetcher

Nós vamos escrever um componente que será responsável por fazer requisições HTTP e enviar os dados para os componentes filhos. Rode no seu terminal:

```bash
mkdir src/fetcher
touch src/fetcher/fetcher.jsx
```

Abra `src/fetcher/fetcher.jsx` e vamos preenchendo juntos.

```jsx
import { useState, useEffect } from "react"

const Fetcher = ({ children, action }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
```

Até aqui, estamos apenas declarando as props do nosso Fetcher, e seus estados iniciais. Nós vamos fazer uso do `useEffect` para fazer a requisição HTTP assim que o componente renderizar.

```jsx
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await action()
        const data = await response.json()

        setData(data)
      } catch (error) {
        setError(error?.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [action])
```

Esse `useEffect` nos diz que ele tentará carregar os dados, e fará o controle do `result`, `error`, e `loading` conforme temos atualizações desses estados. E daqui para frente iremos só retornar com base em cada estado.

```jsx
if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return children(data)
}

export default Fetcher
```

Espero que não tenha ficado muito abstrato por hora, vai ficar mais claro quando implementarmos o resto do nosso código. Abra o terminal, nós vamos trabalhar aqui em fazer o componente que vai receber a listagem de sites.

```bash
mkdir src/sites
touch src/sites/list.jsx
```

Abra o `sites/list.jsx`, e vamos preencher eles juntos.

```jsx
import React from "react"

const SitesList = (props) => {
  const { sites = [] } = props?.data || {}
```

Até aqui, coisa simples, nós esperamos um array de sites, e vamos ou retornar uma lista, ou uma mensagem dizendo que não temos sites.

```jsx
  return (
    <div>
      <h2>Sites:</h2>

      {sites?.length === 0 && <p>No sites</p>}
      <ul>
        {sites.map((site, index) => (
          <li key={`${site.URL}-${site.id}-${index}`}>{site.URL}</li>
        ))}
      </ul>
    </div>
  )
}
```

Agora, vamos trabalhar a `action` que o `Fetcher` vai receber.

```jsx
SitesList.action = () => {
  return fetch("http://localhost:8000/api/sites", {
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    mode: "cors",
  })
}
```

Estaremos utilizando [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), pois é o padrão recomendado para requisições HTTP. E por fim, vamos exportar o componente.

```jsx
export default SitesList
```

> A partir daqui, você já deve ter percebido que eu estou utilizando os nomes em minúsculo, e o CRA usa o padrão PascalCase. Eu prefiro a convenção de arquivos em minúsculo, mas você pode mudar isso se quiser.
> Outra coisa que você talvez já tenha percebido, é que tem arquivos com o final `test.js`, nós vamos escrever testes pros nossos arquivos, mas eu não vou me aprofundar em conteúdos de teste, pelo menos não por hora.

Abra um terminal e rode o seguinte comando:

```bash
touch src/sites/list.test.jsx
```

Abra o `src/sites/list.test.jsx`, e preencha comigo:

```jsx
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React from 'react'
import { render, screen } from '@testing-library/react'
import SitesList from './list'

describe('<SitesList />', () => {
```

Sim, eu adicionei algumas regras que ignoram warnings do Eslint, você pode colocar num arquivo separado, eu deixei aqui mais para simplicidade.

O `describe` agrupa nossos testes, pense como se estivéssemos descrevendo determinado componente. E vamos começar com cada situação, a primeira é o componente não tendo uma lista para renderizar.

```jsx
  test('renders an empty list', () => {
    render(<SitesList />)

    const element = screen.getByText(/No sites/i)

    expect(element).toBeInTheDocument()
  })
```

Próxima condição seria tendo múltiplos elemento, e vamos testar isso.

```jsx
  test('renders an list with multiple elements', () => {
    const { container } = render(<SitesList data={{sites: [ { URL: "test" }, { URL: "test" } ,{ URL: "test" } ]}} />)

    const element = container.querySelectorAll('li')

    expect(element.length).toBe(3)
  })
})
```

Sei que pode parecer bobo, porém esses testes são cruciais para quando formos adicionar opção de editar, e remover sites. E aproveitando a vibe, vamos testar o `fetcher`?

```bash
touch src/fetcher/fetcher.test.jsx
```

No arquivo `fetcher/fetcher.test.jsx` vamos lidar com testes assíncronos, você pode se aprofundar mais na documentação de cada método, porém iremos utilizar a seguinte estrutura:

- `action: MockedPromise<>`
- `WaitFor`
- `Expect`

Vamos ver na prática:

```jsx
/* eslint-disable testing-library/prefer-query-by-disappearance */
/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react'
import { render, screen, waitFor, waitForElementToBeRemoved, act } from '@testing-library/react'
import Fetcher from './fetcher'

describe('<Fetcher />', () => {
```

Até agora nada atípico, certo? Primeiro teste será o de loading:

```jsx
  test('> loading: should call action function', async () => {
    const action = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ info: "test loading" }) }))

    render(
      <Fetcher action={action}>
        {(data) => <div>{data.info}</div>}
      </Fetcher>
    )

    await waitFor(() => expect(action).toBeCalled())

    expect(action).toBeCalled()
  })
```

Perceba que utilizamos os `jest` para mockar uma response, chamamos o render normal, e utilizamos o `await waitFor` para esperar que a função `action` seja chamada, pelo menos uma vez, e em seguida fazemos o teste de que a função `action` foi chamada.

Para o Error, e Success, eles seguem uma estrutura muito parecida:

```jsx
test('> error: should show error', async () => {
    const action = jest.fn(() => Promise.resolve({ json: () => Promise.reject({ message: "test error" }) }))

    act(() => {
      render(
        <Fetcher action={action}>
          {(data) => <div>{data.info}</div>}
        </Fetcher>
      )
    })

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i))

    await screen.findByText(/test error/i)
  })
```

Porém, para esse cenário, não basta apenas a action ser chamada, o Loading tem que sair da tela, então nós esperamos pelo elemento ser removido. O success seria a mesma coisa, porém trocando `reject` por `resolve`.

```tsx
test('> success: should show the content', async () => {
    const action = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ info: "test success" }) }))

    act(() => {
      render(
        <Fetcher action={action}>
          {(data) => <div>{data.info}</div>}
        </Fetcher>
      )
    })


    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i))

    await screen.findByText(/test success/i)
  })
})
```

Com isso, você já entendeu como vai funcionar testes assíncronos, teste síncronos, e de quebra, você também viu como é a assinatura do nosso componente. Vamos agora fazer tudo renderizar.

```bash
touch src/app.jsx
touch src/index.jsx
```

Abra o `src/app.jsx`, e vamos importar ambos o Fetcher e o SitesList, e renderizar:

```jsx
import Fetcher from './fetcher/fetcher'
import SiteList from './sites/list'

function App() {
  return (
    <div className="App">
      <Fetcher action={SiteList.action}>
        {(data) => {
          return (
            <SiteList data={data} />
          )
        }}
      </Fetcher>
    </div>
  )
}

export default App
```

Depois, abra o `src/index.jsx` para chamarmos o nosso App na DOM:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Se você seguiu o tutorial até aqui, você pode abrir o [http://localhost:3000](http://localhost:3000) e ver o resultado.

Você deve abrir as ferramentas de desenvolvedor do seu navegador, lá você verá que a requisição deu errado por conta do CORS, nó vamos resolver isso agora.

> Veja mais sobre o CORS [aqui](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

### Resolvendo o CORS

Resolver CORS costuma ser algo que atormenta muitos desenvolvedores, porém a solução costuma também ser simples. Rode o comando no terminal.

```bash
go get github.com/gin-contrib/cors
```

Em seguida, abra o `server/http.go`, e adicione o módulo de CORS:

```go
import (
	"github.com/gin-contrib/cors"
	/* ... */
)

/* ... */

func (a *Server) Run() {
	database.NewDB()
	defer database.Close()

	router := gin.Default()
	router.Use(cors.Default())
  /* ... */
```

Prontinho, com isso seu Front-end já deve estar funcionando, e mostrando pelo menos uma lista básica de Sites.

Nas próximas aulas, nós vamos fazer o Front-end enviar POST, DELETE, e PUT para o Back-end, nesse meio tempo, que tal você entender o que fizemos no Front-end de forma mais profunda?

Aguardo na próxima aula.
