import React, {useContext} from 'react'
import {StoreContext, ActiveNoteContext} from '../../context'

export const NoteList = () => {
  const {notes} = useContext(StoreContext)
  const {setActiveNote} = useContext(ActiveNoteContext)

  return (
    <ul className="note-list">
      {notes.map(({title, content}, i) => (
        <li key={i} className="note-list__item">
          <button
            className="note-list__button"
            onClick={() => setActiveNote({title, content})}
          >
            {title}
          </button>
        </li>
      ))}
    </ul>
  )
}
