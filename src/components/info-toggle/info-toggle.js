import React, {useState} from 'react'
import {Dialog} from '@reach/dialog'
import {IconInfo, IconClose} from '../index'

import '@reach/dialog/styles.css'

export const InfoToggle = () => {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <>
      <button type="button" className="info-modal__toggle" onClick={open}>
        <span className="sr-only">About this app</span>
        <IconInfo />
      </button>

      <Dialog isOpen={isOpen} onDismiss={close} className="info-modal">
        <button className="info-modal__close" onClick={close}>
          <span className="sr-only">Close</span>
          <span aria-hidden>
            <IconClose />
          </span>
        </button>

        <p className="info-modal__content">
          Made by{' '}
          <a
            className="link"
            href="https://github.com/shwilliam"
            target="_blank"
            rel="noopener noreferrer"
          >
            @shwilliam
          </a>
        </p>

        <p className="info-modal__content">
          If you have any issues, comments or suggestions, please submit them{' '}
          <a
            className="link"
            href="https://github.com/shwilliam/hamster/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
      </Dialog>
    </>
  )
}
