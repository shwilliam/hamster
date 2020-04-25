export const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_ACTIVE_NOTE':
      if (state?.activeNote?.id === action.payload.note?.id) {
        return state
      } else {
        return {activeNote: action.payload.note, isEditing: false}
      }

    case 'UPDATE_EDITING':
      return {...state, isEditing: action.payload.isEditing}

    default:
      return state
  }
}
