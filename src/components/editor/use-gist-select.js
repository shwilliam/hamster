import {useReducer} from 'react'

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

    default:
      return state
  }
}

export const useGistSelect = (initialGists = []) => {
  const [gistSelectState, dispatch] = useReducer(gistSelectStateReducer, {
    gists: initialGists,
    selectedGist: null,
    selectedFilename: null,
    gistSyncing: false,
  })

  const onGistSelect = gist =>
    dispatch({type: 'ON_GIST_SELECT', payload: {gist}})

  const onGistFileSelect = filename =>
    dispatch({type: 'ON_FILE_SELECT', payload: {filename}})

  const onGistSyncStart = () =>
    dispatch({type: 'ON_GIST_SYNC_STATE_CHANGE', payload: {gistSyncing: true}})

  const onGistSyncEnd = () =>
    dispatch({type: 'ON_GIST_SYNC_STATE_CHANGE', payload: {gistSyncing: false}})

  return {
    ...gistSelectState,
    onGistSelect,
    onGistFileSelect,
    onGistSyncStart,
    onGistSyncEnd,
  }
}
