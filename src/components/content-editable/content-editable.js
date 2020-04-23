import React, {useState, useRef, useEffect, useCallback} from 'react'
import {stopEventPropagation} from '../../utils'

export const ContentEditable = ({
  value = '',
  isEditing = false,
  onSave,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef(null)

  const handleChange = useCallback(e => {
    const inputValue = e.target.value
    setInputValue(inputValue)
  }, [])

  const handleSave = useCallback(() => {
    const inputValue = inputRef.current.value.trim()

    if (inputValue.length > 0) {
      setInputValue(inputValue)
      onSave(inputValue)
    }
  }, [onSave])

  const handleKeyDown = useCallback(
    e => {
      // save on enter & escape
      if (isEditing && ['Enter', 'Escape'].includes(e.key)) {
        handleSave()
      }
    },
    [handleSave, isEditing],
  )

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus()
    }
  }, [isEditing])

  if (isEditing)
    return (
      <input
        type="text"
        ref={inputRef}
        onClick={stopEventPropagation}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        value={inputValue}
        onChange={handleChange}
        {...props}
      />
    )

  return <p {...props}>{inputValue || value}</p>
}
