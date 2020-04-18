import React, {useState} from 'react'
import {SearchContext} from './context'

export const SearchContextProvider = ({children}) => {
  const [query, setQuery] = useState('')

  return (
    <SearchContext.Provider value={{query, setQuery}}>
      {children}
    </SearchContext.Provider>
  )
}
