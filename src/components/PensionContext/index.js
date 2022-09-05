import React from 'react'
import { getData } from '../../middleware/getData.js'
import { getSubGraphData } from '../../middleware/getSubGraphData.js';


const PensionContext = React.createContext({
  currentUser: null
});

function PensionProvider (props) {

  const [items, setItems] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  const joinData = async () => {
    try {
      setLoading(false)
    } catch (error) {
      setError(error)
      setLoading(false);
      console.log(error)
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
