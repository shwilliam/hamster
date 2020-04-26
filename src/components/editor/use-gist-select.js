import {useReducer, useContext} from 'react'
import {stateToMarkdown} from 'draft-js-export-markdown'
import {GistContext, ActiveNoteContext} from '../../context'

const gistSelectStateReducer = (state, {type, payload}) => {
  switch (type) {
    case 'ON_GIST_SELECT':
      return {
        ...state,
        selectedGist: payload.gist,
        selectedFilename: Object.keys(payload.gist.files)[0],
      }

    case 'ON_FILE_SELECT':
      return {...state, selectedFilename: payload.filename}

    case 'ON_GIST_SYNC_STATE_CHANGE':
      return {...state, gistSyncing: payload.gistSyncing}

    case 'TOGGLE_GIST_OPTIONS':
      return {...state, gistSyncOptionsOpen: !state.gistSyncOptionsOpen}

    default:
      return state
  }
}

export const useGistSelect = (initialGists = []) => {
  const {activeNote} = useContext(ActiveNoteContext)
  const {gists, syncGist, onError} = useContext(GistContext)
  const [gistSelectState, dispatch] = useReducer(gistSelectStateReducer, {
    gists: initialGists,
    selectedGist: null,
    selectedFilename: null,
    gistSyncing: false,
    gistSyncOptionsOpen: false,
  })

  const onGistSelect = gist =>
    dispatch({type: 'ON_GIST_SELECT', payload: {gist}})

  const onGistFileSelect = filename =>
    dispatch({type: 'ON_FILE_SELECT', payload: {filename}})

  const onGistSyncStart = () =>
    dispatch({type: 'ON_GIST_SYNC_STATE_CHANGE', payload: {gistSyncing: true}})

  const onGistSyncEnd = () =>
    dispatch({type: 'ON_GIST_SYNC_STATE_CHANGE', payload: {gistSyncing: false}})

  const toggleGistSyncOptions = () => dispatch({type: 'TOGGLE_GIST_OPTIONS'})

  const handleGistInputChange = e => onGistSelect(gists[e.target.value])
  const handleGistFileInputChange = e => onGistFileSelect(e.target.value)
  const handleGistSave = content => {
    const gist = gistSelectState.selectedGist
      ? gistSelectState.selectedGist
      : gists[0]
    const filename =
      gistSelectState.selectedFilename || Object.keys(gist.files)[0]

    onGistSyncStart()
    syncGist({
      gist_id: gist.id,
      filename,
      content: stateToMarkdown(content),
    })
      .then(() => {
        toggleGistSyncOptions()
        new Notification('Saved to Gist!', {
          body: `Markdown content from '${activeNote.title}' saved to '${filename}'.`,
        })
      })
      .catch(() => onError())
      .finally(() => onGistSyncEnd())
  }

  return {
    ...gistSelectState,
    onGistSelect,
    onGistFileSelect,
    onGistSyncStart,
    onGistSyncEnd,
    handleGistInputChange,
    handleGistFileInputChange,
    handleGistSave,
    toggleGistSyncOptions,
  }
}
