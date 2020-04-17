import React, {useReducer, useEffect, useCallback} from 'react'
import {StoreContext} from './context'
import {reducer} from './reducer'

export const StoreContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, {notes: []})

  const createNote = useCallback(
    title => dispatch({type: 'CREATE_NOTE', payload: {title}}),
    [],
  )

  const updateNote = useCallback(
    (id, content) => dispatch({type: 'UPDATE_NOTE', payload: {id, content}}),
    [],
  )

  useEffect(() => {
    dispatch({type: 'GET_ALL_NOTES'})
  }, [])

  return (
    <StoreContext.Provider value={{...state, createNote, updateNote}}>
      {children}
    </StoreContext.Provider>
  )
}
