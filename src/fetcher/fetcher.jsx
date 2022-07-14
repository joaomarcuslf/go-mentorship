import { useState, useEffect } from "react"

const Fetcher = ({ children, action }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)


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

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return children(data)
}

export default Fetcher
