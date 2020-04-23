import React, {useContext, useRef, useLayoutEffect} from 'react'
import {StoreContext, ActiveNoteContext} from '../../context'
import {formatReadableTimestamp} from '../../utils'
import {ContentEditable} from '../index'

export const NoteList = () => {
  const noteListRef = useRef()
  const {activeNote, isEditing, updateActiveNote, setEditingFalse} = useContext(
    ActiveNoteContext,
  )
  const {notes, updateNoteTitle} = useContext(StoreContext)
  const prevNotes = useRef(notes)

  useLayoutEffect(() => {
    if (prevNotes.current.length !== notes.length) {
      updateActiveNote(notes[0])
      noteListRef.current.scrollTo(0, 0)

      prevNotes.current = notes
    }
  }, [notes, updateActiveNote, activeNote])

  const handleNoteTitleChange = (id, title) => {
    updateNoteTitle(id, title)
    setEditingFalse()
  }

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
            onClick={() => updateActiveNote(note)}
          >
            <p className="info note-list__label">
              {formatReadableTimestamp(note.modified)}
            </p>
            <ContentEditable
              isEditing={activeNote && isEditing && activeNote.id === note.id}
              className="note-list__label note-list__label--editable"
              value={note.title}
              onSave={title => handleNoteTitleChange(note.id, title)}
            />
          </button>
        </li>
      ))}
    </ul>
  )
}
