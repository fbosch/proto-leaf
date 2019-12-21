import './styles/main.scss'

import { useComponents, usePages } from './hooks'

import { ComponentsProvider } from './contexts/ComponentsContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import { LayoutProvider } from './contexts/LayoutContext'
import { PageProvider } from './contexts/PageContext'
import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './components/Routes'

function App () {
  const pages = usePages()
  const components = useComponents()
  return (
    <LayoutProvider>
      <PageProvider value={pages}>
        <ComponentsProvider value={components}>
          <ErrorBoundary>
            <Layout><Routes pages={pages} /></Layout>
          </ErrorBoundary>
        </ComponentsProvider>
      </PageProvider>
    </LayoutProvider>

  )
}

ReactDOM.render(<App />, document.getElementById('root'))
