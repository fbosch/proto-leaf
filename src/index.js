import React, { Suspense } from 'react'
import { useComponent, useComponents, usePages } from './hooks'

import { ComponentsProvider } from './contexts/ComponentsContext'
import { PageProvider } from './contexts/PageContext'
import ReactDOM from 'react-dom'

function Page () {
  const GlobalMenu = useComponent('globalMenu')
  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        {<GlobalMenu />}
      </Suspense>
    </div>
  )
}

function App () {
  const pages = usePages()
  const components = useComponents()

  return (
    <ComponentsProvider value={components}>
      <PageProvider value={pages}>
        <Page />
        {JSON.stringify(pages)}
      </PageProvider>
    </ComponentsProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
