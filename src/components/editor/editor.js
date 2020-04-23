import React, {useContext, useState, useEffect, useRef} from 'react'
import {
  Editor as DraftEditor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import {stateToMarkdown} from 'draft-js-export-markdown'
import {ActiveNoteContext, StoreContext} from '../../context'
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconCopy,
  IconTrash,
  IconEdit,
} from '../icon'

const {clipboard} = window.require('electron')

export const Editor = () => {
  const editorRef = useRef()
  const {activeNote, clearActiveNote, setEditingTrue, isEditing} = useContext(
    ActiveNoteContext,
  )
  const previousActiveNote = useRef()
  const {updateNote, deleteNote} = useContext(StoreContext)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  useEffect(() => {
    if (!activeNote) return

    const prevContent = activeNote.content
    const prevContentObj = prevContent && convertFromRaw(prevContent)

    if (previousActiveNote.current !== activeNote.id) {
      editorRef.current.focus()
      previousActiveNote.current = activeNote.id
      const updatedEditorState = EditorState.createWithContent(
        convertFromRaw(activeNote.content),
      )
      setEditorState(EditorState.moveFocusToEnd(updatedEditorState))
    } else if (
      // TODO: debounce/throttle
      JSON.stringify(prevContentObj) !==
      JSON.stringify(editorState.getCurrentContent())
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

  const copyMdContent = () => {
    const markdownContent = stateToMarkdown(editorState.getCurrentContent())

    clipboard.writeText(markdownContent, 'selection')
    new Notification('Copied to clipboard!', {
      body: `Markdown content from '${activeNote.title}' copied successfully.`,
    })
  }

  const handleDeleteNote = () => {
    deleteNote(activeNote.id)
    clearActiveNote()
  }

  if (!activeNote)
    return (
      <span className="hamster" role="img" aria-label="Hamster">
        🐹
      </span>
    )

  return (
    <section className="editor">
      <div className="editor__actions">
        <button
          title="Edit title"
          className="editor__action"
          type="button"
          data-active={isEditing}
          onClick={setEditingTrue}
        >
          <span className="sr-only">Edit title</span>
          <IconEdit />
        </button>
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
        <button
          title="Copy markdown"
          className="editor__action"
          type="button"
          onClick={copyMdContent}
        >
          <span className="sr-only">Copy markdown</span>
          <IconCopy />
        </button>
        <button
          title="Delete note"
          className="editor__action"
          type="button"
          onClick={handleDeleteNote}
        >
          <span className="sr-only">Delete note</span>
          <IconTrash />
        </button>
      </div>

      <div className="editor__input">
        <DraftEditor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </section>
  )
}
