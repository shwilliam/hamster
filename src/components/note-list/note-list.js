import React, {useContext} from 'react'
import {StoreContext, ActiveNoteContext, SearchContext} from '../../context'
import {formatReadableTimestamp} from '../../utils'

export const NoteList = () => {
  const {notes} = useContext(StoreContext)
  const {query} = useContext(SearchContext)
  const {activeNote, setActiveNote} = useContext(ActiveNoteContext)

  const filteredNotes = notes.filter(({title}) =>
    query ? title.includes(query) : true,
  )

  return (
    <ul className="note-list">
      {query && (
        <li className="note-list__item-container note-list__item-container--new">
          <div className="note-list__item">
            <p className="info">just now</p>
            <p>{query}</p>
          </div>
        </li>
      )}
      {filteredNotes.map(note => (
        <li
          key={note.id}
          className="note-list__item-container"
          data-active={activeNote && activeNote.id === note.id}
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
