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
          <header className="small app__header">
            <ActionBar />
          </header>
          <section className="app__sidebar">
            <NoteList />
          </section>
          <main className="app__content">
            <Editor />
          </main>
          <aside>
            <h1 className="app__title">
              <span className="sr-only">Hamster</span>
              <span role="img" aria-label="Hamster emoji">
                🐹
              </span>
            </h1>
            <InfoToggle />
          </aside>
        </div>
      </GistContextProvider>
    </ActiveNoteProvider>
  </NotesContextProvider>
)
