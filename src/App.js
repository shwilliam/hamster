import React from 'react'
import {StoreContextProvider, ActiveNoteProvider} from './context'
import {ActionBar, NoteList, Editor, InfoToggle} from './components'

export const App = () => (
  <StoreContextProvider>
    <ActiveNoteProvider>
      <div className="app">
        <header className="app__header">
          <ActionBar />
        </header>
        <section className="app__sidebar">
          <NoteList />
        </section>
        <main className="app__content">
          <Editor />
        </main>
        <aside>
          <InfoToggle />
        </aside>
      </div>
    </ActiveNoteProvider>
  </StoreContextProvider>
)
