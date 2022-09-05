import React from 'react'

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
