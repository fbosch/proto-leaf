/* eslint-env worker */

import camelCase from 'lodash/camelCase'
import every from 'lodash/every'
import isEmpty from 'lodash/isEmpty'
import memoize from 'lodash/memoize'
import omitBy from 'lodash/omitBy'

importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-functions.js')
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-database.js')

const mainSheet = process.env.SPREADSHEET_ID
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
  self.app = self.firebase.initializeApp(config)
  self.database = self.firebase.database()
  self.functions = self.app.functions('europe-west1')

  self.addEventListener('message', event => {
    const { action, ...rest } = event.data
    switch (action) {
      case 'authenticate': return authenticate(rest)
      case 'components': return subscribeToComponents(rest)
      case 'pages': return subscribeToPages(rest)
    }
  })
} else {
  console.warn('🔥 Firebase WebWorker initialization failed')
}

function authenticate ({ client, password, spreadsheet = mainSheet }) {
  const auth = self.functions.httpsCallable('authenticate')
  console.log(spreadsheet)
  auth({ client, password, spreadsheet }).then(result => {
    if (result) self.postMessage('authenticate', result)
  }).catch(error => {
    console.error(error)
  })
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

  const componentsRef = self.database.ref(`/${mainSheet}/Components`)
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

  const pagesRef = self.database.ref(`/${mainSheet}${client ? '/' + client : ''}`)
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
