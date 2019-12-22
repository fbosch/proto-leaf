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
import camelCase from 'lodash/camelCase'
import startCase from 'lodash/startCase'

document.title = startCase(camelCase(window.location.pathname.replace('/', '')))

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
  })
}

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
