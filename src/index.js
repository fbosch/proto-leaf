import './styles/main.scss'

import React, { Suspense, lazy, useEffect } from 'react'

import { AuthenticationProvider } from './contexts/AuthenticationContext'
import Cookies from 'js-cookie'
import LoadingIndicator from './components/LoadingIndicator'
import ReactDOM from 'react-dom'
import queryString from 'query-string'
import startCase from 'lodash/startCase'
import { useAuthentication } from './hooks'

document.title = startCase(window.location.pathname.replace('/', ''))

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
    })
  }

  document.addEventListener('load', () => {
    window.firebase.initializeApp({
      apiKey: process.env.FIREBASE_APIKEY,
      projectId: 'protoleaf-6fbe1',
      messagingSenderId: '985773592777',
      appId: '1:985773592777:web:975852c9b59a2bcc8ffd18',
      measurementId: 'G-RMTQBWLYXN'
    })
    window.firebase.analytics()
  })
}

ReactDOM.render(<App />, document.getElementById('root'))

function App () {
  const client = getClient()
  const PageContents = lazy(() => import('./components/PageContents'))
  const LoginFailed = lazy(() => import('./components/LoginFailed'))
  const { authenticated, authenticate, clientLeafs, loginFailed } = useAuthentication({ client })

  useEffect(() => {
    if (authenticated === false) {
      authenticate(window.prompt('Enter Password'))
    }
  }, [authenticated, authenticate])

  return (
    <AuthenticationProvider value={authenticated}>
      <Suspense fallback={<LoadingIndicator />}>
        {loginFailed ? <LoginFailed /> : (authenticated && <PageContents client={client} leafs={clientLeafs} />)}
      </Suspense>
    </AuthenticationProvider>
  )
}

function getClient () {
  const defaultClient = 'Default'
  const excludedClients = ['default', '', 'Leafs']
  const parameters = queryString.parse(window.location.search)
  const validClientName = !parameters?.client?.includes('.') && parameters?.client !== 'default'
  const client = (validClientName ? parameters.client : undefined) ||
 (excludedClients.includes(parameters.client)
   ? defaultClient
   : Cookies.get('client') || defaultClient
 )

  if (validClientName === false) {
    console.warn(
  `Provided client name "${parameters.client}" is invalid.
                          ⇧

  🔴 Client Spreadsheets cannot have a "." in their name.
  🔵 Fallback client "${client}" is loaded.
  `
    )
  }
  return client
}
