import React, {useContext} from 'react'
import {StoreContext, ActiveNoteContext} from '../../context'
import {formatReadableTimestamp} from '../../utils'

export const NoteList = () => {
  const {notes} = useContext(StoreContext)
  const {setActiveNote} = useContext(ActiveNoteContext)

  return (
    <ul className="note-list">
      {notes.map(({title, content, modified}, i) => (
        <li key={i} className="note-list__item">
          <button
            className="note-list__button"
            onClick={() => setActiveNote({title, content})}
          >
            <p className="info">{formatReadableTimestamp(modified)}</p>
            <p>{title}</p>
          </button>
        </li>
      ))}
    </ul>
  )
}
