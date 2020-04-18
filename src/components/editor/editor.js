import React, {useContext, useState, useEffect} from 'react'
import {
  Editor as DraftEditor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import {ActiveNoteContext, StoreContext} from '../../context'

export const Editor = () => {
  const {activeNote} = useContext(ActiveNoteContext)
  const {updateNote} = useContext(StoreContext)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      setEditorState(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  useEffect(() => {
    if (activeNote)
      setEditorState(
        EditorState.createWithContent(convertFromRaw(activeNote.content)),
      )
  }, [activeNote])

  useEffect(() => {
    if (activeNote) {
      updateNote(activeNote.id, convertToRaw(editorState.getCurrentContent()))
    }
  }, [editorState, activeNote, updateNote])

  if (!activeNote)
    return (
      <span role="img" aria-label="Hamster">
        🐹
      </span>
    )

  return (
    <section className="editor">
      <DraftEditor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
      />
    </section>
  )
}
