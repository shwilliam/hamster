import {ContentState, convertToRaw} from 'draft-js'
import shortid from 'shortid'
import {store} from './store'
import {sortByModified} from '../../utils'

export const reducer = (stateAcc, {type, payload}) => {
  const existingNotes = stateAcc.notes || []
  let noteIdx

  switch (type) {
    case 'GET_ALL_NOTES':
      return {
        ...stateAcc,
        notes: store.get('__hamster-notes__')?.sort(sortByModified) || [],
      }

    case 'CREATE_NOTE':
      const updatedNotes = [
        {
          id: shortid.generate(),
          title: payload.title,
          content: convertToRaw(ContentState.createFromText('')),
          modified: new Date().toISOString(),
        },
        ...existingNotes,
      ].sort(sortByModified)

      store.set('__hamster-notes__', updatedNotes)

      return {...stateAcc, notes: updatedNotes}

    case 'UPDATE_NOTE':
      noteIdx = existingNotes.findIndex(({id: noteId}) => noteId === payload.id)

      existingNotes[noteIdx] = {
        ...existingNotes[noteIdx],
        content: payload.content,
        modified: new Date().toISOString(),
      }

      const sortedUpdatedNotes = existingNotes.sort(sortByModified)

      store.set('__hamster-notes__', sortedUpdatedNotes)

      return {...stateAcc, notes: sortedUpdatedNotes}

    case 'DELETE_NOTE':
      noteIdx = existingNotes.findIndex(({id: noteId}) => noteId === payload.id)

      existingNotes.splice(noteIdx, 1)

      store.set('__hamster-notes__', existingNotes)

      return {...stateAcc, notes: existingNotes}

    default:
      return stateAcc
  }
}
