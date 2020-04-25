import React from 'react'
import {
  NotesContextProvider,
  ActiveNoteProvider,
  GistContextProvider,
} from './context'
import {ActionBar, NoteList, Editor, InfoToggle} from './components'

export const App = () => (
  <NotesContextProvider>
    <ActiveNoteProvider>
      <GistContextProvider>
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
      </GistContextProvider>
    </ActiveNoteProvider>
  </NotesContextProvider>
)
