import React, {useContext, useEffect} from 'react'
import {StoreContext, SearchContext} from '../../context'
import {useInput} from '../../hooks'
import {IconSearch, IconPen} from '../index'

export const ActionBar = () => {
  const {setQuery} = useContext(SearchContext)
  const {createNote} = useContext(StoreContext)
  const [value, handleChange, clearInput] = useInput()

  useEffect(() => {
    setQuery(value)
  }, [value, setQuery])

  const handleSubmit = e => {
    e.preventDefault()

    const trimmedValue = value.trim()
    if (trimmedValue.length === 0) return
    createNote(trimmedValue)

    clearInput()
  }

  return (
    <form onSubmit={handleSubmit} className="action-bar">
      <label>
        <span className="action-bar__icon">
          {!value ? <IconSearch /> : <IconPen />}
        </span>
        <input
          placeholder="Search or create..."
          className="action-bar__input"
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={clearInput}
        />
      </label>
    </form>
  )
}
