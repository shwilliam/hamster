import {useState, useEffect} from 'react'
import {saveAs} from 'file-saver'
import {formatFilename} from '../../utils'

export const useSaveToFilesystem = ({initialFilename}) => {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(s => !s)

  const [filename, setFilename] = useState(initialFilename || '')

  const handleSave = content => {
    saveAs(new Blob([content], {type: 'text/plain;charset=utf-8'}), filename)
  }

  useEffect(() => {
    if (initialFilename) setFilename(`${formatFilename(initialFilename)}.md`)
  }, [initialFilename])

  return {
    open,
    toggleOpen,
    handleSave,
    filename,
    handleFilenameChange: setFilename,
  }
}
