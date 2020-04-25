import {Octokit} from '@octokit/rest'
import {store} from '../../store'

export const reducer = (stateAcc, {type, payload}) => {
  switch (type) {
    case 'INIT':
      let secret = store.get('__hamster-gh-secret__')

      if (!secret) {
        // no local secret
        secret = payload.secret

        store.set('__hamster-gh-secret__', secret)
        // TODO: allow changing secret
      }

      const octokit = new Octokit({auth: secret})

      return {...stateAcc, secret, octokit, error: null}

    case 'UPDATE_GISTS':
      return {
        ...stateAcc,
        gists: payload.gists,
      }

    case 'ON_ERROR':
      return {
        ...stateAcc,
        error: true,
      }

    default:
      return stateAcc
  }
}
