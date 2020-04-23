import React, {useReducer} from 'react'
import {ActiveNoteContext} from './context'
import {reducer} from './reducer'

export const ActiveNoteProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, {
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
