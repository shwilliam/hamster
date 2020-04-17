import shortid from 'shortid'
import {store} from './store'
import {sortByModified} from '../../utils'

export const reducer = (stateAcc, {type, payload}) => {
  const existingNotes = stateAcc.notes || []

  switch (type) {
    case 'GET_ALL_NOTES':
      return {
        ...stateAcc,
        notes: store.get('__hamster-notes__')?.sort(sortByModified) || [],
      }
    case 'CREATE_NOTE':
      const notesWithNew = [
        ...existingNotes,
        {
          id: shortid.generate(),
          title: payload.title,
          content: '',
          modified: new Date().toISOString(),
        },
      ]

      const sortedNotesWithNew = notesWithNew.sort(sortByModified)

      store.set('__hamster-notes__', sortedNotesWithNew)

      return {...stateAcc, notes: sortedNotesWithNew}

    case 'UPDATE_NOTE':
      const noteIdx = existingNotes.findIndex(
        ({id: noteId}) => noteId === payload.id,
      )

      existingNotes[noteIdx] = {
        ...existingNotes[noteIdx],
        content: payload.content,
      }
      const sortedUpdatedNotes = existingNotes.sort(sortByModified)

      store.set('__hamster-notes__', sortedUpdatedNotes)

      return {...stateAcc, notes: sortedUpdatedNotes}

    default:
      return stateAcc
  }
}
