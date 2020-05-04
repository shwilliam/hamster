import {ContentState, convertToRaw} from 'draft-js'
import {
  adjust,
  compose,
  findIndex,
  insert,
  mergeLeft,
  mergeRight,
  prop,
  propEq,
  remove,
} from 'ramda'
import shortid from 'shortid'
import {store} from '../../store'
import {sortByModified, defaultToEmptyArray} from '../../utils'

const makeNoteObj = title => ({
  id: shortid.generate(),
  title,
  content: convertToRaw(ContentState.createFromText('')),
  modified: new Date().toISOString(),
})

export const reducer = (stateAcc, {type, payload}) => {
  const mergeState = mergeRight(stateAcc)
  const existingNotes = defaultToEmptyArray(stateAcc.notes)

  switch (type) {
    case 'GET_ALL_NOTES':
      return mergeState({
        notes: compose(
          sortByModified,
          defaultToEmptyArray,
        )(store.get('__hamster-notes__')),
      })

    case 'CREATE_NOTE':
      return mergeState({
        notes: compose(
          sortByModified,
          insert(-1)(makeNoteObj(prop('title', payload))),
        )(existingNotes),
      })

    case 'UPDATE_NOTE':
      return mergeState({
        notes: compose(sortByModified, adjust)(
          findIndex(propEq('id', prop('id', payload)))(existingNotes),
          mergeLeft({
            content: prop('content', payload),
            modified: new Date().toISOString(),
          }),
          existingNotes,
        ),
      })

    case 'UPDATE_NOTE_TITLE':
      return mergeState({
        notes: compose(sortByModified, adjust)(
          findIndex(propEq('id', prop('id', payload)))(existingNotes),
          mergeLeft({title: prop('title', payload)}),
          existingNotes,
        ),
      })

    case 'DELETE_NOTE':
      return mergeState({
        notes: remove(
          findIndex(propEq('id', prop('id', payload)))(existingNotes),
          1,
        )(existingNotes),
      })

    default:
      return stateAcc
  }
}
