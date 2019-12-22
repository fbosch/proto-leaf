/* eslint-env worker */

import camelCase from 'lodash/camelCase'
import every from 'lodash/every'
import isEmpty from 'lodash/isEmpty'
import memoize from 'lodash/memoize'
import omitBy from 'lodash/omitBy'

self.addEventListener('message', event => {
  const { action, ...rest } = event.data
  switch (action) {
    case 'components': return subscribeToComponents(rest)
    case 'pages': return subscribeToPages(rest)
  }
})

importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-database.js')

const config = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: 'protoleaf-6fbe1.firebaseapp.com',
  databaseURL: 'https://protoleaf-6fbe1.firebaseio.com',
  projectId: 'protoleaf-6fbe1',
  storageBucket: 'protoleaf-6fbe1.appspot.com',
  messagingSenderId: '985773592777',
  appId: '1:985773592777:web:975852c9b59a2bcc8ffd18',
  measurementId: 'G-RMTQBWLYXN'
}

console.info('🔥 Initializing Firbase WebWorker')
self.firebase.initializeApp(config)
const database = self.firebase.database()
const spreadsheet = process.env.SPREADSHEET_ID

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

function subscribeToComponents () {
  const format = memoize(formatComponents)
  console.info('✔️ Subscribed to Components Spreadsheet')
  const componentsRef = database.ref(`/${spreadsheet}/Components`)
  componentsRef.on('value', snapshot => {
    const components = snapshot.val()
    if (!components) return
    // remove unused and empty properties and format naming to fit componentMap
    const value = format(components)
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

function subscribeToPages ({ client }) {
  const format = memoize(formatPages)
  console.info('✔️ Subscribed to Pages Spreadsheet')
  const pagesRef = database.ref(`/${spreadsheet}${client ? '/' + client : ''}`)
  pagesRef.on('value', snapshot => {
    const pages = snapshot.val()
    if (!pages) return
    const value = format(pages)
    self.postMessage({ action: 'pages', value })
  })
}
