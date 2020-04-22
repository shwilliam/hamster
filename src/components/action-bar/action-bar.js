import React, {useContext, useState, useCallback} from 'react'
import {useCombobox} from 'downshift'
import {StoreContext, ActiveNoteContext} from '../../context'
import {IconSearch, IconPen} from '../index'

const placeholderNote = {
  title: '',
  id: null,
  __placeholder__: true,
}

export const ActionBar = () => {
  const {notes, createNote} = useContext(StoreContext)
  const {setActiveNote} = useContext(ActiveNoteContext)
  const [inputItems, setInputItems] = useState([...notes, placeholderNote])
  const stateReducer = useCallback(
    (state, actionAndChanges) => {
      switch (actionAndChanges.type) {
        // on select
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.InputBlur:
          const {changes} = actionAndChanges
          const {selectedItem} = changes

          if (!selectedItem || changes?.highlightedIndex === -1)
            return actionAndChanges.changes

          if (selectedItem.__placeholder__) {
            const trimmedValue = state.inputValue.trim()
            if (trimmedValue.length > 0) {
              createNote(trimmedValue)
            }
          } else {
            setActiveNote(selectedItem)
            window[`note-${selectedItem.id}`].scrollIntoView()
          }

          return {
            ...actionAndChanges.changes,
            inputValue: '',
          }
        default:
          return actionAndChanges.changes
      }
    },
    [createNote, setActiveNote],
  )
  const {
    isOpen,
    inputValue,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    stateReducer,
    itemToString: item => item?.title ?? null,
    onInputValueChange: ({inputValue}) => {
      setInputItems([
        ...notes.filter(
          note =>
            note.__placeholder__ ||
            note.title.toLowerCase().includes(inputValue.toLowerCase()),
        ),
        placeholderNote,
      ])
    },
    defaultHighlightedIndex: 0,
  })

  return (
    <div {...getComboboxProps()} className="action-bar">
      <label {...getLabelProps()}>
        <span className="action-bar__icon">
          {isOpen && highlightedIndex === inputItems.length - 1 ? (
            <IconPen />
          ) : (
            <IconSearch />
          )}
        </span>
        <span className="sr-only">Search or create notes</span>
      </label>
      <input
        placeholder="Search or create..."
        className="action-bar__input"
        type="text"
        {...getInputProps()}
      />
      {isOpen && (
        <ul {...getMenuProps()} className="action-bar__results">
          {inputItems.map((item, index) => (
            <li
              className="action-bar__result"
              data-type={item.__placeholder__ ? 'CREATE' : 'SEARCH'}
              style={
                highlightedIndex === index ? {backgroundColor: '#bde4ff'} : {}
              }
              key={item.id}
              {...getItemProps({item, index})}
            >
              {item.__placeholder__ ? inputValue : item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
