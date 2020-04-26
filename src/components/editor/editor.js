import React, {useRef, useEffect, useContext} from 'react'
import {Editor as DraftEditor} from 'draft-js'
import {stateToMarkdown} from 'draft-js-export-markdown'
import {ActiveNoteContext, GistContext} from '../../context'
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconCopy,
  IconTrash,
  IconCode,
  IconGitHub,
  IconSave,
} from '../icon'
import {useEditor} from './use-editor'
import {BLOCK_TYPES} from './block-types'
import {EditorAction} from './editor-action'
import {useGistSelect} from './use-gist-select'
import {useSaveToFilesystem} from './use-save-to-filesystem'

export const Editor = () => {
  const editorRef = useRef()
  const gistInitRef = useRef()
  const {activeNote} = useContext(ActiveNoteContext)
  const {init, octokit, gists, error} = useContext(GistContext)
  const {
    selectedGist,
    selectedFilename,
    gistSyncing,
    handleGistInputChange,
    handleGistFileInputChange,
    handleGistSave,
    gistSyncOptionsOpen,
    toggleGistSyncOptions,
  } = useGistSelect(gists)
  const {
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
  } = useEditor(editorRef)

  const {
    open: saveToFilesystemOpen,
    toggleOpen: toggleSaveToFilesystem,
    handleSave: handleSaveToFilesystem,
    filename: saveToFilesystemFilename,
    handleFilenameChange: handleSaveToFilesystemFilenameChange,
  } = useSaveToFilesystem({initialFilename: activeNote?.title})

  const handleGistInitSubmit = e => {
    e.preventDefault()
    init(gistInitRef.current.value)
  }

  const handleGistSaveSubmit = e => {
    e.preventDefault()
    handleGistSave(editorState.getCurrentContent())
  }

  const handleFilenameInputChange = e => {
    handleSaveToFilesystemFilenameChange(e.target.value)
  }

  const handleSaveToFilesystemSubmit = e => {
    e.preventDefault()
    handleSaveToFilesystem(stateToMarkdown(editorState.getCurrentContent()))
    toggleSaveToFilesystem() // TODO: delay toggle until save success
  }

  useEffect(() => {
    if (gistInitRef.current && error) gistInitRef.current.value = ''
  }, [error])

  if (!activeNote)
    return (
      <span className="hamster" role="img" aria-label="Hamster">
        🐹
      </span>
    )

  return (
    <section className="editor">
      <div className="pad--h editor__actions">
        <EditorAction
          title="Bold (Command+B)"
          onClick={toggleBold}
          label="Toggle bold"
        >
          <IconBold />
        </EditorAction>
        <EditorAction
          title="Italic (Command+I)"
          onClick={toggleItalic}
          label="Toggle italic"
        >
          <IconItalic />
        </EditorAction>
        <EditorAction
          title="Underline (Command+U)"
          onClick={toggleUnderline}
          label="Toggle underline"
        >
          <IconUnderline />
        </EditorAction>
        <EditorAction
          title="Toggle code"
          onClick={toggleCode}
          label="Toggle code"
        >
          <IconCode />
        </EditorAction>
        {BLOCK_TYPES.map(({label, style, icon: Icon}) => (
          <EditorAction
            key={style}
            title={`Toggle ${label}`}
            onClick={() => toggleBlock(style)}
            label={`Toggle ${label}`}
          >
            {Icon ? <Icon /> : label}
          </EditorAction>
        ))}
        <EditorAction
          title="Copy markdown"
          onClick={copyMdContent}
          label="Copy markdown"
        >
          <IconCopy />
        </EditorAction>
        <EditorAction
          title="Save to GitHub gist"
          onClick={toggleGistSyncOptions}
          label="Save to GitHub gist"
          data-active={gistSyncOptionsOpen}
        >
          <IconGitHub />
        </EditorAction>
        <EditorAction
          title="Save to filesystem"
          onClick={toggleSaveToFilesystem}
          label="Save to filesystem"
          data-active={saveToFilesystemOpen}
        >
          <IconSave />
        </EditorAction>
        <EditorAction
          title="Delete note"
          onClick={handleDeleteNote}
          label="Delete note"
        >
          <IconTrash />
        </EditorAction>

        <div className="width--full">
          {saveToFilesystemOpen && (
            <form
              onSubmit={handleSaveToFilesystemSubmit}
              className="border--top pad--h pad--v font-size--small flex"
            >
              <label className="width--half">
                <span className="sr-only">Filename</span>
                <input
                  placeholder="Filename..."
                  className="input"
                  type="text"
                  value={saveToFilesystemFilename}
                  onChange={handleFilenameInputChange}
                />
              </label>

              <button className="border--all button" type="submit">
                Save
              </button>
            </form>
          )}
        </div>

        <div className="width--full">
          {gistSyncOptionsOpen &&
            (octokit && gists.length && !error ? (
              <form
                onSubmit={handleGistSaveSubmit}
                className="font-size--small border--top pad--v flex"
              >
                <label className="width--half pad--h">
                  <span className="sr-only">Select a gist</span>

                  <select
                    className="input"
                    value={
                      selectedGist
                        ? gists.findIndex(({id}) => id === selectedGist.id)
                        : gists[0]
                    }
                    onChange={handleGistInputChange}
                  >
                    {gists?.map((gist, idx) => (
                      <option key={gist.id} value={idx}>
                        {gist.description}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="width--half pad--h">
                  <span className="sr-only">Select a file to save to</span>

                  <select
                    className="input"
                    value={
                      selectedFilename ||
                      Object.keys(selectedGist?.files || gists[0].files)[0]
                    }
                    onChange={handleGistFileInputChange}
                  >
                    {Object.keys(selectedGist?.files || gists[0].files).map(
                      (filename, idx) => (
                        <option key={`${filename}${idx}`} value={filename}>
                          {filename}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <button
                  className="border--all button"
                  type="submit"
                  disabled={gistSyncing}
                >
                  Save
                </button>
              </form>
            ) : (
              <form
                className="font-size--small border--top pad--v pad--h flex"
                onSubmit={handleGistInitSubmit}
              >
                <label className="width--half">
                  {/* TODO: note gist priviledges */}
                  <span className="sr-only">Enter your GitHub secret</span>
                  <input
                    ref={gistInitRef}
                    type="text"
                    className="input width--full"
                    placeholder="GitHub secret..."
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="border--all button"
                  disabled={octokit && !gists.length && !error}
                >
                  Save
                </button>
              </form>
            ))}
        </div>
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
