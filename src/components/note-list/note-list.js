import React, {useContext} from 'react'
import {StoreContext, ActiveNoteContext} from '../../context'
import {formatReadableTimestamp} from '../../utils'

export const NoteList = () => {
  const {notes} = useContext(StoreContext)
  const {activeNote, setActiveNote} = useContext(ActiveNoteContext)

  return (
    <ul className="note-list">
      {notes.map(note => (
        <li
          key={note.id}
          className="note-list__item"
          data-active={activeNote && activeNote.id === note.id}
        >
          <button
            type="button"
            className="note-list__button"
            onClick={() => setActiveNote(note)}
          >
            <p className="info">{formatReadableTimestamp(note.modified)}</p>
            <p>{note.title}</p>
          </button>
        </li>
      ))}
    </ul>
  )
}
