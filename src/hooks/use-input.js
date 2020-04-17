import {useState, useCallback} from 'react'

export const useInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue)

  const handleChange = useCallback(e => {
    setValue(e.target.value)
  }, [])

  const clearInput = useCallback(() => {
    setValue('')
  }, [])

  return [value, handleChange, clearInput]
}
