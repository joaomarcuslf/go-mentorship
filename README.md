# Golang Lessons

Este repositório tem o objetivo de ensinar os tópicos principais, e uma forma de aprender Go.

## Como usar

Vá nas Tags desse projeto, nelas estarão qual o número da aula, e dentro de cada aula o README.md será modificado para que você possa ver quais os objetivos da aula.

Se você quiser acompanhar desde o início, procure pela tag `lesson-00`, e mude o link no go.mod para ser seu nome no Github.

## O que você já deve saber

Esse repositório parte do princípio que você já fez o [download e instalou o Golang](https://go.dev/) em sua máquina, e que você fez o [tutorial da página do Go](https://go.dev/tour/welcome/1). Sendo assim, você deve estar minimamente ambientado com a sintaxe, e com os princípios da linguagem.

## Objetivo da aula:

### Expectativas

Nessa aula vamos colocar vamos focar em consumir todos os métodos da nossa API com nosso Front-end.

### Colocando nosso CSS

Você talvez esteja cansado já da tela sem muitas belezas, porém você já deve ter percebido que deixamos para trás alguns arquivos quando usávamos o HTML, e não o React, vamos puxar esses arquivos para nosso novo Front-end.

Rode o seguinte comando no terminal:

```bash
mv static/main.css public/main.css
```

Agora, abra o `public/index.html`, e adicione dentro da tag `<head>` a importação do CSS:

```html
    <link rel="stylesheet" href="%PUBLIC_URL%/main.css" />
    <title>QR Code Generator</title>
  </head>
```

Você pode aproveitar, e mudar o `<title>` para o title que usávamos antes na home.

> Você sabe por quê estamos tirando o HTML de dentro da nossa API? No conteúdo adicional eu irei explicar um pouco melhor, porém a suma, um servidor ficar responsável tanto pelo HTML, quanto pelos dados pode tornar o servidor lento, o que é um problema.

Agora vamos criar um componente que vai ser responsável pela nossa casca da home.

```bash
mkdir src/pages
touch src/pages/home.jsx
```

Abra o `pages/home.jsx`, e por hora, nós vamos replicar o que tem dentro do `templates/index.html`.

```jsx
import React from "react"

const HomePage = () => {
  return (
    <section className="hero is-purple is-light is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-8-tablet is-7-desktop is-7-widescreen">
              <form action="/generator" method="post" className="box">
                <div className="field">
                  <label className="label has-text-left">
                    Please enter the string you want to QRCode.
                  </label>

                  <div className="control">
                    <input
                      className="input"
                      placeholder="e.g. www.google.com"
                      name="url"
                    />
                  </div>
                </div>

                <div className="field has-text-right">
                  <button className="button is-purple is-rounded is-medium is-fullwidth">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage
```

Por hora, eu só repliquei a HTML de dentro do `templates/index.html`, mudando `class` para `className`, que é o padrão do React, e mudando o `dataString` para `url` para ficar melhor descrito o campo, agora vamos abrir o `src/app.jsx`, e importar o HomePage lá dentro:

```jsx
import HomePage from './pages/home'

function App() {
  return (
    <div className="App">
      <HomePage />
    </div>
  )
}

export default App
```

Relaxa que o Fetcher já já volta. Volte para o `pages/home.jsx`, e vamos começar a criar nossa requisição.

```jsx
import Fetcher from '../fetcher/fetcher'
import SiteList from '../sites/list'

const postSite = (body) => {
  return fetch("http://localhost:8000/api/sites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

const HomePage = () => {
```

Perceba, que a gente está importando o Fetcher, e o SiteList, agora dentro do componente, vamos declarar o `url` como um estado, e chamar nosso `handleSubmit`.

> Essa nomenclatura de handle<EventName> é uma padronização de escrita muito usual no Front-end.

```jsx
const HomePage = () => {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showList, setShowList] = useState(true)

  const updateList = () => {
    setShowList(false)

    setTimeout(() => {
      setShowList(true)
    }, 100)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      const response = await postSite({ url })
      const data = await response.json()

      if (response.status >= 400) {
        throw new Error(data.message)
      }

      updateList()
    } catch (error) {
      setError(error?.message)
    } finally {
      setLoading(false)
    }
  }
```

Muitas coisas estão acontecendo no nesse trecho, porém basicamente estamos enviando uma requisição no submit do formulário, e vamos atualizar a lista quando a requisição terminar. Vamos juntos pelo JSX.

```jsx
              <form className="box" onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label has-text-left">
                    Please enter the string you want to QRCode.
                  </label>

                  <div className="control">
                    <input
                      className={error ? "input is-danger" : "input"}
                      placeholder="e.g. www.google.com"
                      name="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>

                  {error && <p className="help is-danger">{error}</p>}
                </div>

                <div className="field has-text-right">
                  <button
                    className="button is-purple is-rounded is-medium is-fullwidth"
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </form>
```

Nosso form fica assim, perceba que agora nós verificamos erros, e bloqueamos o botão de submit quando estiver carregando os dados. Logo depois do form, vamos mostrar a lista de sites:

```jsx
           </div>
          </div>

          {showList && (
            <div className="columns is-centered">
              <div className="column is-8-tablet is-7-desktop is-7-widescreen">
                <div className="box">
                  <Fetcher action={SiteList.action}>
                    {(data) => {
                      return <SiteList data={data} />
                    }}
                  </Fetcher>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
```

Se você olhar agora no seu navegador, você vai ver que quando você clica no submit você está criando um novo site, porém nós perdemos a validação de se enviarmos a URL vazia, vamos para o `handlers/api/sites.go`, e vamos mexer no método `Create`.

```go
func (sc *SiteController) Create(c *gin.Context) {
	site := &database.Site{}
	c.BindJSON(site)

	if site.URL == "" {
		c.JSON(400, gin.H{
			"message": "Site URL is required",
		})
		return
	}

	sc.db.Add(site.URL)

	c.JSON(201, gin.H{})
}
```

Aproveitando que estamos nesse arquivo, vamos também criar um método que retorne o QR code:

```go
func (sc *SiteController) ShowQr(c *gin.Context) {
	id := c.Param("id")

	site, err := sc.db.Get(id)

	if err != nil {
		c.JSON(404, gin.H{
			"error": err.Error(),
		})
		return
	}

	qr := generator.NewQRCode()

	err = qr.SetBarcode(site.URL).ToPNG(c.Writer)

	if err != nil {
		render.NewPage().AsHome().SetError(err, http.StatusBadRequest).Write(c)
	}
}
```

> Não se esqueça de atualizar os imports do arquivo `handlers/api/sites.go` para o `generator` e `render`.

E como declaramos um método novo, vamos no nosso `server/htttp.go` para colocar esse rota:

```go
	router.GET("/api/sites/:id", sc.Show)
	router.GET("/api/sites/:id/qr", sc.ShowQr)
	router.PUT("/api/sites/:id", sc.Update)
```

Ainda aproveitando que estamos no Go, é uma boa prática declararmos qual a chave queremos que nossos campos respeitem no json, abra o `database/db.go`, e na linha `type Site struct {` vamos adicionar quais as chaves do json:

```go
type Site struct {
	URL string `json:"url"`
	Id  string `json:"id"`
}
```

Com isso o Go irá automaticamente converter `URL` para `url`, seguindo o padrão empregado no Front-end.

Nós vamos agora atualizar o `sites/list.jsx` para suportar o delete, e melhorar a listagem dele, com isso, irei empregar o método TDD, vou primeiro mexer nos testes, depois no arquivo de fato, abra o `sites/list.test.jsx`, vamos começar atualizando o segundo teste:

```jsx
  test('renders an list with multiple elements', () => {
    const { container } = render(<SitesList data={{sites: [ { url: "test" }, { url: "test" } ,{ url: "test" } ]}} />)

    const element = container.querySelectorAll('.site-item')

    expect(element.length).toBe(3)
  })
```

Nosso objeto agora vai esperar `url` ao invés de `URL`, e os elementos vão ter uma classe específica para eles, agora vamos para o `sites/list.jsx`, e atualizar ele.

```jsx
import React from "react";
import ShowSite from "./show";

const SitesList = (props) => {
  const { sites = [] } = props?.data || {};

  return (
    <div>
      <h2 className="is-title">Sites:</h2>

      {sites?.length === 0 && <p>No sites</p>}

      <div className="columns is-multiline">
        {sites.map((site, index) => {
          return (
            <div className="column is-6 site-item" key={`${site.url}-${site.id}-${index}`}>
              <ShowSite
                url={site?.url}
                id={site?.id}
                showContent={props.showContent}
                handleDelete={props.handleDelete}
                handleEdit={props.handleEdit}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

Perceba, que agora nós estamos passando url, id e handleDelete, porém esse componente ShowSite não existe, certo? Vamos criar ele, rode os seguintes comandos no terminal:

```bash
touch src/sites/show.jsx
touch src/sites/show.test.jsx
```

Abra o `sites/show.test.jsx`, primeiro, nele nós vamos testar se o componente chama tries métodos:
- `showContent`: Função responsável por mostrar nosso QR code.
- `handleEdit`: Função responsável por editar o site.
- `handleDelete`: Função responsável por deletar o site.

Porém como esses cenários usam o Back-end, nós só iremos nos preocupar se ele está chamando ou não essas funções.

```jsx
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import ShowSite from './show'

describe('<ShowSite />', () => {
```

Até agora nada atípico, vamos criar o primeiro teste:

```jsx
  test('showContent: should be called on element click', async () => {
    const mockFn = jest.fn()

    render(<ShowSite url="test" id="test" showContent={mockFn} />)

    let element = screen.getByText(/test/i)

    expect(element).toBeInTheDocument()
    element.click()

    await waitFor(() => expect(mockFn).toHaveBeenCalled())
    expect(mockFn).toHaveBeenCalled()
  })
```

Esse teste apenas está dizendo que quando eu clicar na URL que será o título do nosso componente, agora vamos testar o edit que seguirá mais ou menos o mesmo que o show.

> Se você não conhece o waitFor, volte uma aula.

```jsx
  test('handleEdit: should be callend on the Edit click', () => {
    const mockFn = jest.fn()

    render(<ShowSite url="test" id="test" handleEdit={mockFn} />)

    let element = screen.getByText(/Edit/i)

    expect(element).toBeInTheDocument()
    element.click()

    expect(mockFn).toHaveBeenCalled()
  })
```

A partir daqui é onde precisamos fazer algo a mais, o delete chamará o `confirm`, para validar se o usuário tem certeza ou não que deve deletar, para isso, nós vamos mocar o `global.confirm` no nosso teste.

```jsx
  test('handleDelete: should call delete on confirmation', () => {
    global.confirm = jest.fn(() => true)

    const mockFn = jest.fn()

    render(<ShowSite url="test" id="test" handleDelete={mockFn} />)

    let element = screen.getByText(/Delete/i)

    expect(element).toBeInTheDocument()
    element.click()

    expect(global.confirm).toHaveBeenCalled()
    expect(mockFn).toHaveBeenCalled()
  })
```

E para desencargo de consciência, vamos testar também se o usuário `não` quer deletar.

```jsx
  test('handleDelete: should not call delete on confirmation', () => {
    global.confirm = jest.fn(() => false)

    const mockFn = jest.fn()

    render(<ShowSite url="test" id="test" handleDelete={mockFn} />)

    let element = screen.getByText(/Delete/i)

    expect(element).toBeInTheDocument()
    element.click()

    expect(global.confirm).toHaveBeenCalled()
    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})
```

Com isso, vamos abrir o `sites/show.jsx`, e adicionar lá nosso código:

```jsx
/* eslint-disable no-restricted-globals */
import React, { useState } from "react";

const ShowSite = ({ url, id, showContent, handleDelete, handleEdit }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteClick = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete this site (${url})?`);

    if (confirmDelete) {
      handleDelete(id)
    }
  }

  const handleEditClick = async () => {
    handleEdit(id)
  }

  return (
    <div className="card mb-5">
      <header className="card-header">
        <button
          className="button is-medium is-fullwidth"
          aria-label="more options"
          onClick={() => setIsOpen(!isOpen)}
        >
          {url}
        </button>
      </header>

      {isOpen && showContent(id)}

      <footer className="card-footer">
        <button className="card-footer-item button is-link" onClick={handleEditClick}>
          Edit
        </button>
        <button className="card-footer-item button is-link" onClick={handleDeleteClick}>
          Delete
        </button>
      </footer>
    </div>
  );
};

export default ShowSite;
```

Agora vamos abrir `pages/home.jsx`, e vamos declarar nossas funções lá. Embaixo do `postSite` coloque o seguinte código:

```jsx
const getQrURL = (id) => `http://localhost:8000/api/sites/${id}/qr`

const showContent = (id) => (
  <div className="card-content">
    <div className="content has-text-centered">
      <img src={getQrURL(id)} alt="favicon" />
    </div>
  </div>
)

const updateSite = (id) => {
  return fetch(`http://localhost:8000/api/sites/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    mode: "cors",
  });
}

const deleteSite = (id) => {
  return fetch(`http://localhost:8000/api/sites/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
    mode: "cors",
  });
}
```

Esses métodos que interagem com o Back-end, nós vamos em breve refatorar para nosso `home.jsx` não precisar declarar esses métodos.

Agora, dentro do `HomePage`, vamos declarando os métodos individualmente.

```jsx
  const handleEdit = async (id) => {
    try {
      const response = await editSite(id);
      if (response.status >= 400) {
        throw new Error(response.message);
      }

      updateList();
    } catch (error) {
      alert(error.message);
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await deleteSite(id);
      if (response.status >= 400) {
        throw new Error(response.message);
      }

      updateList();
    } catch (error) {
      alert(error.message);
    }
  };
```

Está sentindo esse cheiro? Cheiro de repetição de código? Anote isso, nós vamos refatorar tudo isso em breve. Atualize o SiteList dentro desse arquivo.

```jsx
  <SiteList
    data={data}
    showContent={showContent}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
  />
```

Até aqui você já deve ter funcionando  `GET /sites`, `POST /sites`, `DELETE /sites/:id`, e `GET /sites/:id/qr`. Abra seu navegador, veja funcionando, e se orgulhe, pois já foi um caminho longo.

Para o `PUT /sites/:id`, vamos ver na próxima aula, assim como a refatoração do `home.jsx`. Fique bem, até a próxima.

### Adicionais

#### Quando separar um sistema?

Você já deve ter ouvido falar sobre `Monolito`, `Microsserviços`, e outras palavras Hypadas. E você também já deve ter ouvido uma ODE direcionada a odiar Monolitos, e eu espero desmistificar esse ódio para você.

Monolito é uma arquitetura de sistemas ondem a mesma aplicação é responsável por tanto entregar a camada de visualização(Ex.: HTML), quanto a de dados(Ex.: JSON). Essa arquitetura normalmente fica complexo a médio, longo prazo, e muitas vezes tem uma característica de parecer suja, pois os códigos se confundem, e se embolam.

Normalmente, é apresentado como solução Microsserviços, e na maior parte das vezes, os microsserviços ficam complexos a médio, longo prazo, muitas vezes sujos, os códigos se confundem, e se embolam.

Pera, você viu o que aconteceu? Não? Sim?

Não importa a arquitetura que você escolher, se ela não for bem planejada, e mantida, ela vai ficar complexa, não importa qual você escolher, ambas as abordagens tem suas vantagens, e desvantagens, em geral, a regra que eu aplico para escrever sistemas é:

> Quando eu preciso de que as regras de negócio sejam bem acopladas entre a camada de visualização, e camada de dados, Monolitos costumam ser uma arquitetura muito boa, pois ela me permite manter o código compartilhado, e nesses cenários eu aplico uma boa divisão dos código, mantendo eles agnósticos de onde estão rodando, algo muito parecido com os Use Cases descritos no [Clean Arch](https://dev.to/thiagosilva95/clean-architecture-o-que-e-vantagens-e-como-utilizar-em-aplicacoes-na-pratica-4ej8).

> Quando eu preciso que meu sistema seja granular, e independentes entre si, eu costumo preferir Microsserviços, pois cada sistema pode ter seu deploy separado, e quando um cair, não necessariamente irá afetar o outro. Essa é uma arquitetura que costuma onerar o Front-end pois para o navegador abrir várias conexões HTTP com respostas pequenas é pior do que receber uma response única grandem então nesse cenário costumo aplicar uma camada de [BFF na frente](https://brasil.uxdesign.cc/quem-%C3%A9-o-bff-na-fila-do-p%C3%A3o-ef58d87bbab0).
