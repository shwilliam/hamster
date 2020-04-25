import React, {useRef, useEffect, useContext} from 'react'
import {Editor as DraftEditor} from 'draft-js'
import {ActiveNoteContext, GistContext} from '../../context'
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconCopy,
  IconTrash,
  IconCode,
  IconGitHub,
} from '../icon'
import {useEditor} from './use-editor'
import {BLOCK_TYPES} from './block-types'
import {EditorAction} from './editor-action'
import {useGistSelect} from './use-gist-select'

export const Editor = () => {
  const editorRef = useRef()
  const gistInitRef = useRef()
  const {activeNote} = useContext(ActiveNoteContext)
  const {init, octokit, gists, error} = useContext(GistContext)
  const {selectedGist, selectedFilename, gistSyncing} = useGistSelect(gists)
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

    gistSyncOptionsOpen,
    toggleGistSyncOptions,
    handleGistInputChange,
    handleGistFileInputChange,
    handleGistSyncSubmit,
  } = useEditor(editorRef)

  const handleGistInitSubmit = e => {
    e.preventDefault()
    init(gistInitRef.current.value)
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
      <div className="editor__actions">
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
          title="Delete note"
          onClick={handleDeleteNote}
          label="Delete note"
        >
          <IconTrash />
        </EditorAction>

        <div className="editor__actions-row">
          {gistSyncOptionsOpen &&
            (octokit && gists.length && !error ? (
              <form
                onSubmit={handleGistSyncSubmit}
                className="gist-select__container"
              >
                <label className="gist-select__input-wrapper">
                  <span className="sr-only">Select a gist to view files</span>

                  <select
                    className="gist-select__input"
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

                <label className="gist-select__input-wrapper">
                  <span className="sr-only">Select a file to sync to</span>

                  <select
                    className="gist-select__input"
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
                  className="gist-select__submit"
                  type="submit"
                  disabled={gistSyncing}
                >
                  Save
                </button>
              </form>
            ) : (
              <form
                className="gist-select__container"
                onSubmit={handleGistInitSubmit}
              >
                <label className="gist-select__input-wrapper">
                  {/* TODO: note gist priviledges */}
                  <span className="sr-only">Enter your GitHub secret</span>
                  <input
                    ref={gistInitRef}
                    type="text"
                    className="gist-select__input"
                    placeholder="Enter your GitHub secret..."
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="gist-select__submit"
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
