/* eslint-env worker */

import camelCase from 'lodash/camelCase'
import every from 'lodash/every'
import isEmpty from 'lodash/isEmpty'
import memoize from 'lodash/memoize'
import omitBy from 'lodash/omitBy'

importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-database.js')

const spreadsheet = process.env.SPREADSHEET_ID
const config = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: 'protoleaf-6fbe1.firebaseapp.com',
  databaseURL: 'https://protoleaf-6fbe1.firebaseio.com',
  projectId: 'protoleaf-6fbe1',
  storageBucket: 'protoleaf-6fbe1.appspot.com',
  messagingSenderId: '985773592777',
  appId: '1:985773592777:web:975852c9b59a2bcc8ffd18'
}

if (self.firebase) {
  console.info('🔥 Initialized Firbase WebWorker')
  self.firebase.initializeApp(config)
  self.database = self.firebase.database()
} else {
  console.warn('🔥 Firebase WebWorker initialization failed')
}

self.addEventListener('message', event => {
  const { action, ...rest } = event.data
  switch (action) {
    case 'authenticate': return authenticate(rest)
    case 'components': return subscribeToComponents(rest)
    case 'pages': return subscribeToPages(rest)
  }
})

function authenticate ({ client, password }) {
  console.log(client, password)
}

function formatComponentProperties (component) {
  const formattedComponent = omitBy(component, isEmpty)
  Object.keys(formattedComponent).forEach(key => {
    if (typeof formattedComponent[key] === 'string') {
      formattedComponent[key].trim()
    }
  })

  return formattedComponent
}

const formatProps = memoize(formatComponentProperties)

function formatComponents (components) {
  return JSON.stringify(Object.keys(components).reduce((accum, component) => ({
    ...accum, // convert components object to camelCasing
    [camelCase(component)]: formatProps(components[component])
  }), {}))
}

function subscribeToComponents ({ cache }) {
  let initialized = false
  const format = memoize(formatComponents)
  console.info('✔️ Subscribed to "Components" spreadsheet')

  const componentsRef = self.database.ref(`/${spreadsheet}/Components`)
  componentsRef.on('value', snapshot => {
    const components = snapshot.val()
    if (!components) {
      console.warn('No data received from "Components" spreadsheet')
      return
    }
    // remove unused and empty properties and format naming to fit componentMap
    const value = format(components)
    if (value === cache && initialized === false) {
      initialized = true
      return
    }
    if (initialized === false) initialized = true
    self.postMessage({ action: 'components', value })
  })
}

function formatPages (pages) {
  return JSON.stringify(pages.filter(page => {
    if (every(Object.values(page), isEmpty)) return false // filter out empty pages
    return true
  }).map(page => {
    if (isEmpty(page.components) === false) {
      const rows = page.components.split('\n')
      page.components = rows.map(row => row.split(',').map(camelCase)) // convert to camelCase to match mapped components
    }
    return page
  }))
}

function subscribeToPages ({ client, cache }) {
  let initialized = false
  const format = memoize(formatPages)
  console.info(`✔️ Subscribed to "${client}" spreadsheet`)

  const pagesRef = self.database.ref(`/${spreadsheet}${client ? '/' + client : ''}`)
  pagesRef.on('value', snapshot => {
    const pages = snapshot.val()
    if (!pages) {
      console.warn(`No data received from "${client}" spreadsheet. It might not exist yet.`)
      return
    }
    const value = format(pages)
    if (value === cache && initialized === false) {
      initialized = true
      return
    }
    if (initialized === false) initialized = true
    self.postMessage({ action: 'pages', value })
  })
}
