import React from 'react'
import {StoreContextProvider} from './context'
import {ActionBar, NoteList} from './components'

export const App = () => (
  <StoreContextProvider>
    <div className="app">
      <header className="app__header">
        <ActionBar />
      </header>
      <main className="app__content">
        <NoteList />
      </main>
    </div>
  </StoreContextProvider>
)
