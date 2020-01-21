import 'toastify-js/src/toastify.css'
import './styles/main.scss'

import React, { useEffect } from 'react'

import { AuthenticationProvider } from './contexts/AuthenticationContext'
import Cookies from 'js-cookie'
import LoginFailed from './components/LoginFailed'
import PageContents from './components/PageContents'
import ReactDOM from 'react-dom'
import Toastify from 'toastify-js'
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
  const authentication = useAuthentication({ client })
  const { authenticated, authenticate, loginFailed } = authentication

  useEffect(() => {
    const copyComponentOnClick = event => {
      if (event.altKey) {
        const closestComponent = event.target.closest('[data-component]')
        if (closestComponent) {
          const componentName = closestComponent.getAttribute('data-component')
          if (componentName) {
            event.preventDefault()
            navigator.clipboard.writeText(componentName).then(() => {
              console.log(componentName, 'copied to clipboard! 📋')
              Toastify({
                backgroundColor: 'white',
                gravity: 'top',
                text: '📋 Component name copied to clipboard!'
              }).showToast()
            })
          }
        }
      }
    }
    document.addEventListener('click', copyComponentOnClick)
    return () => document.removeEventListener('click', copyComponentOnClick)
  })

  useEffect(() => {
    if (authenticated === false) {
      const password = window.prompt('Enter Password')
      authenticate(password)
    }
  }, [authenticated, authenticate])

  return (
    <AuthenticationProvider value={authentication}>
      {loginFailed ? <LoginFailed /> : (authenticated && <PageContents client={client} />)}
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
