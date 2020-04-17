export const sortByModified = (a, b) => {
  a = new Date(a.modified)
  b = new Date(b.modified)

  return a > b ? -1 : 1
}
