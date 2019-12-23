import './styles/main.scss'
import 'loading-attribute-polyfill'

import React, { useEffect } from 'react'
import { useAuthentication, useComponents, usePages } from './hooks'

import { AuthenticationProvider } from './contexts/AuthenticationContext'
import { ComponentsProvider } from './contexts/ComponentsContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import { LayoutProvider } from './contexts/LayoutContext'
import { PageProvider } from './contexts/PageContext'
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

const parameters = queryString.parse(window.location.search)
const validClientName = parameters.client && !parameters.client.includes('.') && parameters.client !== 'default'
const client = (validClientName ? parameters.client : undefined) ||
 (
   ['default', '', 'Leafs'].includes(parameters.client)
     ? 'Default'
     : window.localStorage.getItem('client') || 'Default'
 )

function App () {
  const [authenticated, authenticate] = useAuthentication({ client })
  const pages = usePages({ analytics, client })
  const components = useComponents({ analytics })
  useEffect(() => {
    if (authenticated === false) {
      const password = window.prompt('Enter Password')
      authenticate(password)
    }
  }, [authenticated, authenticate])

  return (
    <AuthenticationProvider value={{ authenticated }}>
      <PageProvider value={pages}>
        <ComponentsProvider value={components}>
          <LayoutProvider>
            <ErrorBoundary>
              <Layout><Routes pages={pages} /></Layout>
            </ErrorBoundary>
          </LayoutProvider>
        </ComponentsProvider>
      </PageProvider>
    </AuthenticationProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

if (validClientName === false) {
  console.warn(
  `Provided client name "${parameters.client}" is invalid.
                          ⇧

  🔴 Client Spreadsheets cannot have a "." in their name.
  🔵 Fallback client "${client}" is loaded.
  `
  )
}
