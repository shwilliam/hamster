import {sort, descend, prop} from 'ramda'

export const sortByModified = sort(descend(prop('modified')))
