import React, {useContext} from 'react'
import {StoreContext} from '../../context'

export const NoteList = () => {
  const {notes} = useContext(StoreContext)

  return (
    <ul>
      {notes.map(({title}, i) => (
        <li key={i}>{title}</li>
      ))}
    </ul>
  )
}
