import React, {useContext, useState, useEffect} from 'react'
import {Editor as DraftEditor, EditorState, ContentState} from 'draft-js'
import {ActiveNoteContext, StoreContext} from '../../context'
import {useDebounce} from '../../hooks'

export const Editor = () => {
  const {activeNote} = useContext(ActiveNoteContext)
  const {updateNote} = useContext(StoreContext)
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromText(activeNote?.content || ''),
    ),
  )
  const debouncedEditorState = useDebounce(editorState, 400)

  useEffect(() => {
    if (activeNote)
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromText(activeNote?.content.trim() || ''),
        ),
      )
  }, [activeNote])

  useEffect(() => {
    if (activeNote)
      updateNote(
        activeNote.id,
        debouncedEditorState
          .getCurrentContent()
          .getPlainText()
          .trim(),
      )
  }, [debouncedEditorState, activeNote, updateNote])

  if (!activeNote)
    return (
      <span role="img" aria-label="Hamster">
        🐹
      </span>
    )

  return (
    <section>
      <DraftEditor editorState={editorState} onChange={setEditorState} />
    </section>
  )
}
