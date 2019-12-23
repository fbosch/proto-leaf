import './styles/main.scss'

import React, { useEffect } from 'react'

import { AuthenticationProvider } from './contexts/AuthenticationContext'
import PageContents from './components/PageContents'
import ReactDOM from 'react-dom'
import camelCase from 'lodash/camelCase'
import queryString from 'query-string'
import startCase from 'lodash/startCase'
import { useAuthentication } from './hooks'

document.title = startCase(camelCase(window.location.pathname.replace('/', '')))

document.addEventListener('load', () => {
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
  window.firebase.analytics()
})

function App () {
  const client = getClient()
  const { authenticated, authenticate } = useAuthentication({ client })

  useEffect(() => {
    if (authenticated === false) authenticate(window.prompt('Enter Password'))
  }, [authenticated, authenticate])

  return (
    <AuthenticationProvider value={{ authenticated }}>
      <PageContents client={client} />
    </AuthenticationProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

function getClient () {
  const parameters = queryString.parse(window.location.search)
  const validClientName = parameters.client && !parameters.client.includes('.') && parameters.client !== 'default'
  const client = (validClientName ? parameters.client : undefined) ||
 (
   ['default', '', 'Leafs'].includes(parameters.client)
     ? 'Default'
     : window.localStorage.getItem('client') || 'Default'
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
