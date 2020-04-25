import React from 'react'

export const EditorAction = ({label, className = '', children, ...props}) => (
  <button type="button" className={`editor__action ${className}`} {...props}>
    <span className="sr-only">{label}</span>
    {children}
  </button>
)
