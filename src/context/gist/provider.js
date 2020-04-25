import React, {useReducer, useEffect} from 'react'
import {store} from '../../store'
import {GistContext} from './context'
import {reducer} from './reducer'

const fetchGists = octokit =>
  octokit.gists
    .list({
      headers: {
        'If-None-Match': '', // avoid cache
      },
    })
    .then(({data}) => data)

export const GistContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, {
    secret: '',
    octokit: null,
    gists: [],
    error: null,
  })

  const init = secret => dispatch({type: 'INIT', payload: {secret}})

  const onError = () => dispatch({type: 'ON_ERROR'})

  const syncGist = ({gist_id, filename, content}) =>
    state.octokit.gists.update({
      gist_id: gist_id,
      files: {
        [filename]: {
          content: content,
        },
      },
    })

  useEffect(() => {
    const secret = store.get('__hamster-gh-secret__')
    if (secret) init(secret)
  }, [])

  useEffect(() => {
    if (state.octokit && !state.gists?.length) {
      ;(async () => {
        try {
          const initialGists = await fetchGists(state.octokit)
          dispatch({type: 'UPDATE_GISTS', payload: {gists: initialGists}})
        } catch (e) {
          store.delete('__hamster-gh-secret__')
          onError()
        }
      })()
    }
  }, [state.octokit, state.gists])

  return (
    <GistContext.Provider value={{...state, init, syncGist, onError}}>
      {children}
    </GistContext.Provider>
  )
}
