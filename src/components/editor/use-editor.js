import {useRef, useContext, useState, useEffect} from 'react'
import {EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js'
import {stateToMarkdown} from 'draft-js-export-markdown'
import {ActiveNoteContext, StoreContext, GistContext} from '../../context'
import {useGistSelect} from './use-gist-select'

const {clipboard} = window.require('electron')

export const useEditor = ref => {
  const previousActiveNote = useRef()

  const {activeNote, clearActiveNote} = useContext(ActiveNoteContext)
  const {updateNote, deleteNote} = useContext(StoreContext)
  const {gists, syncGist, onError} = useContext(GistContext)

  const {
    selectedGist,
    selectedFilename,
    onGistSelect,
    onGistFileSelect,
    onGistSyncStart,
    onGistSyncEnd,
  } = useGistSelect(gists)

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  useEffect(() => {
    if (!activeNote) return

    const prevContent = activeNote.content
    const prevContentObj = prevContent && convertFromRaw(prevContent)

    if (previousActiveNote.current !== activeNote.id) {
      ref.current.focus()
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
  }, [activeNote, editorState, updateNote, ref])

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

  const toggleCode = () =>
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'CODE'))

  const toggleBlock = style =>
    setEditorState(RichUtils.toggleBlockType(editorState, style))

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

  const [gistSyncOptionsOpen, setGistSyncOptionsOpen] = useState(false)
  const toggleGistSyncOptions = () => setGistSyncOptionsOpen(s => !s)
  const handleGistInputChange = e => onGistSelect(gists[e.target.value])
  const handleGistFileInputChange = e => onGistFileSelect(e.target.value)
  const handleGistSyncSubmit = e => {
    e.preventDefault()

    const gist = selectedGist ? selectedGist : gists[0]
    const filename = selectedFilename || Object.keys(gist.files)[0]

    onGistSyncStart()
    syncGist({
      gist_id: gist.id,
      filename,
      content: stateToMarkdown(editorState.getCurrentContent()),
    })
      .then(() => {
        setGistSyncOptionsOpen(false)
        new Notification('Saved to Gist!', {
          body: `Markdown content from '${activeNote.title}' saved to '${filename}'.`,
        })
      })
      .catch(() => onError())
      .finally(() => onGistSyncEnd())
  }

  return {
    editorState,
    setEditorState,
    handleKeyCommand,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleCode,
    toggleBlock,
    copyMdContent,
    handleDeleteNote,
    gistSyncOptionsOpen,
    toggleGistSyncOptions,
    handleGistInputChange,
    handleGistFileInputChange,
    handleGistSyncSubmit,
  }
}
