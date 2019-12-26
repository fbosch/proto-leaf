import './styles/main.scss'

import React, { useEffect } from 'react'

import { AuthenticationProvider } from './contexts/AuthenticationContext'
import Cookies from 'js-cookie'
import PageContents from './components/PageContents'
import ReactDOM from 'react-dom'
import camelCase from 'lodash/camelCase'
import queryString from 'query-string'
import startCase from 'lodash/startCase'
import { useAuthentication } from './hooks'

document.title = startCase(camelCase(window.location.pathname.replace('/', '')))

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
  const { authenticated, authenticate, clientLeafs, wrongPassword } = useAuthentication({ client })

  useEffect(() => {
    if (authenticated === false) {
      authenticate(window.prompt('Enter Password'))
    }
  }, [authenticated, authenticate])

  return (
    <AuthenticationProvider value={authenticated}>
      {wrongPassword ? 'Wrong Password' : <PageContents client={client} leafs={clientLeafs} />}
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
