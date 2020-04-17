import {store} from './store'

export const reducer = (stateAcc, {type, payload}) => {
  switch (type) {
    case 'GET_ALL_NOTES':
      return {...stateAcc, notes: store.get('__hamster-notes__')}
    case 'CREATE_NOTE':
      const existingNotes = stateAcc.notes || []
      const updatedNotes = [
        ...existingNotes,
        {title: payload.title, content: ''},
      ]
      store.set('__hamster-notes__', updatedNotes)
      return {...stateAcc, notes: updatedNotes}
    default:
      return stateAcc
  }
}
