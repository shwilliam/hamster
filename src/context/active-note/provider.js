import React, {useReducer} from 'react'
import {ActiveNoteContext} from './context'

const stateReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_ACTIVE_NOTE':
      if (state?.activeNote?.id === action.payload.note.id) {
        return state
      } else {
        return {activeNote: action.payload.note, isEditing: false}
      }

    case 'UPDATE_EDITING':
      return {...state, isEditing: action.payload.isEditing}

    default:
      return state
  }
}

export const ActiveNoteProvider = ({children}) => {
  const [state, dispatch] = useReducer(stateReducer, {
    activeNote: null,
    isEditing: false,
  })

  const updateActiveNote = note => {
    dispatch({type: 'UPDATE_ACTIVE_NOTE', payload: {note}})
  }

  const clearActiveNote = () => {
    dispatch({type: 'UPDATE_ACTIVE_NOTE', payload: {note: null}})
  }

  const setEditingTrue = () => {
    dispatch({type: 'UPDATE_EDITING', payload: {isEditing: true}})
  }

  const setEditingFalse = () => {
    dispatch({type: 'UPDATE_EDITING', payload: {isEditing: false}})
  }

  const {activeNote, isEditing} = state
  return (
    <ActiveNoteContext.Provider
      value={{
        activeNote,
        isEditing,
        updateActiveNote,
        clearActiveNote,
        setEditingTrue,
        setEditingFalse,
      }}
    >
      {children}
    </ActiveNoteContext.Provider>
  )
}
