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
import queryString from 'query-string'
import startCase from 'lodash/startCase'

document.title = startCase(camelCase(window.location.pathname.replace('/', '')))

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
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
const paremeters = queryString.parse(window.location.search)
const client = paremeters.client || window.localStorage.getItem('client') || 'Default'

function App () {
  const pages = usePages({ analytics, client })
  const components = useComponents({ analytics })
  return (
    <PageProvider value={pages}>
      <ComponentsProvider value={components}>
        <LayoutProvider>
          <ErrorBoundary>
            <Layout><Routes pages={pages} /></Layout>
          </ErrorBoundary>
        </LayoutProvider>
      </ComponentsProvider>
    </PageProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
