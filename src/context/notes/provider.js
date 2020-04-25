import React, {useReducer, useEffect, useCallback} from 'react'
import {NotesContext} from './context'
import {reducer} from './reducer'

export const NotesContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, {notes: []})

  const createNote = useCallback(
    title => dispatch({type: 'CREATE_NOTE', payload: {title}}),
    [],
  )

  const updateNote = useCallback(
    (id, content) => dispatch({type: 'UPDATE_NOTE', payload: {id, content}}),
    [],
  )

  const updateNoteTitle = useCallback(
    (id, title) => dispatch({type: 'UPDATE_NOTE_TITLE', payload: {id, title}}),
    [],
  )

  const deleteNote = useCallback(
    id => dispatch({type: 'DELETE_NOTE', payload: {id}}),
    [],
  )

  useEffect(() => {
    dispatch({type: 'GET_ALL_NOTES'})
  }, [])

  return (
    <NotesContext.Provider
      value={{...state, createNote, updateNote, updateNoteTitle, deleteNote}}
    >
      {children}
    </NotesContext.Provider>
  )
}
