import React, {useContext, useRef, useLayoutEffect} from 'react'
import {NotesContext, ActiveNoteContext} from '../../context'
import {NoteListItem} from './note-list-item'

export const NoteList = () => {
  const noteListRef = useRef()
  const {activeNote, updateActiveNote, isEditing} = useContext(
    ActiveNoteContext,
  )
  const {notes} = useContext(NotesContext)
  const prevNotes = useRef(notes)

  useLayoutEffect(() => {
    if (prevNotes.current.length !== notes.length) {
      updateActiveNote(notes[0])
      noteListRef.current.scrollTo(0, 0)

      prevNotes.current = notes
    }
  }, [notes, updateActiveNote, activeNote])

  return (
    <ul className="note-list" ref={noteListRef}>
      {notes.map(note => (
        <NoteListItem
          key={note.id}
          note={note}
          active={activeNote?.id === note.id}
          editing={isEditing}
        />
      ))}
    </ul>
  )
}
