import { useState } from 'react'

export const useForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState)

  const reset = (newFomState = initialState) => {
    setValues(newFomState)
  }

  const handleInputChange = ({ target }) => {
    target.type === 'checkbox'
      ? setValues({
        ...values,
        [target.name]: target.checked
      })
      : setValues({
        ...values,
        [target.name]: target.value
      })
  }

  return [values, handleInputChange, reset]
}
