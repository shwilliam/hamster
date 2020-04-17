import React, {useContext} from 'react'
import {ActiveNoteContext} from '../../context'

export const Editor = () => {
  const {activeNote} = useContext(ActiveNoteContext)

  if (!activeNote) return null

  return <p>{activeNote.title}</p>
}
