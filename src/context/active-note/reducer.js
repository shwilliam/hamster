export const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_ACTIVE_NOTE':
      if (state?.activeNote?.id === action.payload.note?.id) {
        return state
      } else {
        return {activeNote: action.payload.note, isEditingTitle: false}
      }

    case 'UPDATE_EDITING':
      return {...state, isEditingTitle: action.payload.isEditingTitle}

    default:
      return state
  }
}
