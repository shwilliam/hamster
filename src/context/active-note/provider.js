import React, {useState} from 'react'
import {ActiveNoteContext} from './context'

export const ActiveNoteProvider = ({children}) => {
  const [activeNote, setActiveNote] = useState()

  return (
    <ActiveNoteContext.Provider value={{activeNote, setActiveNote}}>
      {children}
    </ActiveNoteContext.Provider>
  )
}
