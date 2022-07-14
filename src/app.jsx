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
