import React, {useReducer, useEffect} from 'react'
import {StoreContext} from './context'
import {reducer} from './reducer'

export const StoreContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, {notes: []})

  const createNote = title => dispatch({type: 'CREATE_NOTE', payload: {title}})

  useEffect(() => {
    dispatch({type: 'GET_ALL_NOTES'})
  }, [])

  return (
    <StoreContext.Provider value={{...state, createNote}}>
      {children}
    </StoreContext.Provider>
  )
}
