import React, {useContext, useRef, useLayoutEffect} from 'react'
import {StoreContext, ActiveNoteContext} from '../../context'
import {formatReadableTimestamp} from '../../utils'

export const NoteList = () => {
  const noteListRef = useRef()
  const {activeNote, setActiveNote} = useContext(ActiveNoteContext)
  const {notes} = useContext(StoreContext)
  const prevNotes = useRef(notes)

  useLayoutEffect(() => {
    if (prevNotes.current.length !== notes.length) {
      setActiveNote(notes[0])
      noteListRef.current.scrollTo(0, 0)

      prevNotes.current = notes
    }
  }, [notes, setActiveNote, activeNote])

  return (
    <ul className="note-list" ref={noteListRef}>
      {notes.map(note => (
        <li
          key={note.id}
          id={`note-${note.id}`}
          className="note-list__item-container"
          data-active={activeNote?.id === note.id}
        >
          <button
            type="button"
            className="note-list__item"
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
