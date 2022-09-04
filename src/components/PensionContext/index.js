import React from 'react'
import { getData } from '../../middleware/getData.js'

const PensionContext = React.createContext({
  currentUser: null
});

function PensionProvider (props) {
  const { getAllItems } = getData()

  const [items, setItems] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  const joinData = async () => {
    try {
      const result = await getAllItems()
      // console.log(result)
      setItems(result)
      setLoading(false)
    } catch (error) {
      setError(error)
    }
  }

  React.useEffect(() => {
    joinData()
  }, [])

  return (
    <PensionContext.Provider
      value={{
        items,
        loading,
        error,
      }}
    >
      {props.children}
    </PensionContext.Provider>
  )
}

export { PensionContext, PensionProvider }
