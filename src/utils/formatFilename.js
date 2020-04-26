export const formatFilename = str =>
  str
    .toLowerCase()
    .split(' ')
    .join('_')
