import React, {useContext} from 'react'
import {StoreContext} from '../../context'
import {useInput} from '../../hooks'

export const ActionBar = () => {
  const {createNote} = useContext(StoreContext)
  const [value, handleChange, clearInput] = useInput()

  const handleSubmit = e => {
    e.preventDefault()

    const trimmedValue = value.trim()
    if (trimmedValue.length === 0) return

    createNote(trimmedValue)
    clearInput()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="input-text"
        type="text"
        value={value}
        onChange={handleChange}
      />
    </form>
  )
}
