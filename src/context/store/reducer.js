import {store} from './store'
import {sortByModified} from '../../utils'

export const reducer = (stateAcc, {type, payload}) => {
  switch (type) {
    case 'GET_ALL_NOTES':
      return {
        ...stateAcc,
        notes: store.get('__hamster-notes__')?.sort(sortByModified) || [],
      }
    case 'CREATE_NOTE':
      const existingNotes = stateAcc.notes || []
      const updatedNotes = [
        ...existingNotes,
        {
          title: payload.title,
          content: '',
          modified: new Date().toISOString(),
        },
      ]
      const sortedUpdatedNotes = updatedNotes.sort(sortByModified)

      store.set('__hamster-notes__', sortedUpdatedNotes)
      return {...stateAcc, notes: sortedUpdatedNotes}
    default:
      return stateAcc
  }
}
