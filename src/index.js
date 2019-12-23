import './styles/main.scss'
import 'loading-attribute-polyfill'

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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
  })
}

window.firebase.initializeApp({
  apiKey: process.env.FIREBASE_APIKEY,
  projectId: 'protoleaf-6fbe1',
  messagingSenderId: '985773592777',
  appId: '1:985773592777:web:975852c9b59a2bcc8ffd18',
  measurementId: 'G-RMTQBWLYXN'
})

const analytics = window.firebase.analytics()

function App () {
  const pages = usePages({ analytics })
  const components = useComponents({ analytics })
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
