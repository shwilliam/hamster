import {mergeRight} from 'ramda'
import React, {useReducer} from 'react'
import {ActiveNoteContext} from './context'
import {reducer} from './reducer'

export const ActiveNoteProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, {
    activeNote: null,
    isEditingTitle: false,
  })

  const updateActiveNote = note => {
    dispatch({type: 'UPDATE_ACTIVE_NOTE', payload: {note}})
  }

  const clearActiveNote = () => {
    dispatch({type: 'UPDATE_ACTIVE_NOTE', payload: {note: null}})
  }

  const setEditingTrue = () => {
    dispatch({type: 'UPDATE_EDITING', payload: {isEditingTitle: true}})
  }

  const setEditingFalse = () => {
    dispatch({type: 'UPDATE_EDITING', payload: {isEditingTitle: false}})
  }

  return (
    <ActiveNoteContext.Provider
      value={mergeRight(state)({
        updateActiveNote,
        clearActiveNote,
        setEditingTrue,
        setEditingFalse,
      })}
    >
      {children}
    </ActiveNoteContext.Provider>
  )
}
