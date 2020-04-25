import {ContentState, convertToRaw} from 'draft-js'
import shortid from 'shortid'
import {store} from '../../store'
import {sortByModified} from '../../utils'

export const reducer = (stateAcc, {type, payload}) => {
  const existingNotes = stateAcc.notes || []
  let noteIdx
  let updatedNotes

  switch (type) {
    case 'GET_ALL_NOTES':
      return {
        ...stateAcc,
        notes: store.get('__hamster-notes__')?.sort(sortByModified) || [],
      }

    case 'CREATE_NOTE':
      updatedNotes = [
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

      updatedNotes = existingNotes.sort(sortByModified)

      store.set('__hamster-notes__', updatedNotes)

      return {...stateAcc, notes: updatedNotes}

    case 'UPDATE_NOTE_TITLE':
      noteIdx = existingNotes.findIndex(({id: noteId}) => noteId === payload.id)

      existingNotes[noteIdx] = {
        ...existingNotes[noteIdx],
        title: payload.title,
      }

      updatedNotes = existingNotes.sort(sortByModified)

      store.set('__hamster-notes__', updatedNotes)

      return {...stateAcc, notes: updatedNotes}

    case 'DELETE_NOTE':
      noteIdx = existingNotes.findIndex(({id: noteId}) => noteId === payload.id)

      existingNotes.splice(noteIdx, 1)

      store.set('__hamster-notes__', existingNotes)

      return {...stateAcc, notes: existingNotes}

    default:
      return stateAcc
  }
}
