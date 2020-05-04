import {useEffect, useState} from 'react'
import {saveAs} from 'file-saver'
import {compose, join, split, toLower} from 'ramda'

export const useSaveToFilesystem = ({initialFilename}) => {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(s => !s)

  const [filename, setFilename] = useState(initialFilename || '')

  const handleSave = content => {
    saveAs(new Blob([content], {type: 'text/plain;charset=utf-8'}), filename)
  }

  useEffect(() => {
    if (initialFilename)
      setFilename(
        `${compose(join('_'), split(/ /g), toLower)(initialFilename)}.md`,
      )
  }, [initialFilename])

  return {
    open,
    toggleOpen,
    handleSave,
    filename,
    handleFilenameChange: setFilename,
  }
}
