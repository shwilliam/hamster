import React, {useContext, useEffect, useRef} from 'react'
import {StoreContext, SearchContext} from '../../context'
import {useInput} from '../../hooks'
import {IconSearch, IconPen} from '../index'

export const ActionBar = () => {
  const actionBarRef = useRef()
  const {setQuery} = useContext(SearchContext)
  const {createNote} = useContext(StoreContext)
  const [value, handleChange, clearInput] = useInput()

  useEffect(() => {
    actionBarRef.current.focus()
  }, [])

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
          ref={actionBarRef}
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
