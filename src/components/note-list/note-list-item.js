import React, {useContext, useMemo} from 'react'
import {StoreContext, ActiveNoteContext} from '../../context'
import {formatReadableTimestamp} from '../../utils'
import {ContentEditable, IconEdit} from '../index'

export const NoteListItem = ({
  note,
  active,
  editing,
  className = '',
  ...props
}) => {
  const {updateActiveNote, setEditingTrue, setEditingFalse} = useContext(
    ActiveNoteContext,
  )
  const {updateNoteTitle} = useContext(StoreContext)

  const handleNoteTitleChange = title => {
    updateNoteTitle(note.id, title)
    setEditingFalse()
  }

  const handleNoteClick = () => updateActiveNote(note)

  const timestamp = useMemo(() => formatReadableTimestamp(note.modified), [
    note.modified,
  ])

  return (
    <li
      id={`note-${note.id}`}
      className={`note-list__item-container ${className}`}
      data-active={active}
      {...props}
    >
      <button
        type="button"
        className="note-list__item"
        onClick={handleNoteClick}
      >
        <p className="info note-list__label">{timestamp}</p>
        <ContentEditable
          isEditing={active && editing}
          className="note-list__label note-list__label--editable"
          value={note.title}
          onSave={handleNoteTitleChange}
        />
      </button>

      {active && (
        <button
          title="Edit title"
          className="note-list__action"
          type="button"
          onClick={setEditingTrue}
          data-active={editing}
        >
          <span className="sr-only">Edit title</span>
          <IconEdit />
        </button>
      )}
    </li>
  )
}
