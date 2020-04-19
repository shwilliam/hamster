import React, {useContext, useState, useEffect, useRef} from 'react'
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
  const editorRef = useRef()
  const {activeNote} = useContext(ActiveNoteContext)
  const previousActiveNote = useRef()
  const {updateNote} = useContext(StoreContext)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  useEffect(() => {
    if (!activeNote) return

    const prevContent = activeNote.content
    const prevContentText =
      prevContent && convertFromRaw(prevContent).getPlainText()

    if (previousActiveNote.current !== activeNote.id) {
      editorRef.current.focus()
      previousActiveNote.current = activeNote.id
      const updatedEditorState = EditorState.createWithContent(
        convertFromRaw(activeNote.content),
      )
      setEditorState(EditorState.moveFocusToEnd(updatedEditorState))
    } else if (
      prevContentText !== editorState.getCurrentContent().getPlainText()
    ) {
      updateNote(activeNote.id, convertToRaw(editorState.getCurrentContent()))
    }
  }, [activeNote, editorState, updateNote])

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
      <DraftEditor
        ref={editorRef}
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
      />

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
    </section>
  )
}
