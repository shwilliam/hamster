import React, {useContext, useState, useEffect} from 'react'
import {
  Editor as DraftEditor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import {ActiveNoteContext, StoreContext} from '../../context'
import {IconBold, IconItalic, IconUnderline} from '../icon'

export const Editor = () => {
  const {activeNote} = useContext(ActiveNoteContext)
  const {updateNote} = useContext(StoreContext)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

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

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      setEditorState(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  const toggleBold = () =>
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))

  const toggleItalic = () =>
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))

  const toggleUnderline = () =>
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'))

  if (!activeNote)
    return (
      <span role="img" aria-label="Hamster">
        🐹
      </span>
    )

  return (
    <section className="editor">
      <div className="editor__actions">
        <button
          title="Bold (Command+B)"
          className="editor__action"
          type="button"
          onClick={toggleBold}
        >
          <span className="sr-only">Toggle bold</span>
          <IconBold />
        </button>
        <button
          title="Italic (Command+I)"
          className="editor__action"
          type="button"
          onClick={toggleItalic}
        >
          <span className="sr-only">Toggle italic</span>
          <IconItalic />
        </button>
        <button
          title="Underline (Command+U)"
          className="editor__action"
          type="button"
          onClick={toggleUnderline}
        >
          <span className="sr-only">Toggle underline</span>
          <IconUnderline />
        </button>
      </div>

      <DraftEditor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
      />
    </section>
  )
}
