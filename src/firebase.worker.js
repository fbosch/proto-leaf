/* eslint-env worker */

import camelCase from 'lodash/camelCase'
import every from 'lodash/every'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'
import omitBy from 'lodash/omitBy'

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

self.addEventListener('message', event => {
  const { action, ...rest } = event.data
  switch (action) {
    case 'components': return subscribeToComponents(rest)
    case 'pages': return subscribeToPages(rest)
  }
})

function subscribeToComponents () {
  console.info('✔️ Subscribed to Components Spreadsheet')
  const componentsRef = database.ref(`/${spreadsheet}/Components`)
  const unusedProperties = ['description', 'component', 'category']
  componentsRef.on('value', snapshot => {
    const components = snapshot.val()
    if (!components) return
    // remove unused and empty properties and format naming to fit componentMap
    const formattedComponets = Object.keys(components).reduce((accum, component) => ({
      ...accum, // convert components object to camelCasing
      [camelCase(component)]: {
        ...omit(omitBy(components[component], isEmpty), unusedProperties)
      }
    }), {})
    const value = JSON.stringify(formattedComponets)
    self.postMessage({ action: 'components', value })
  })
}

function subscribeToPages ({ client }) {
  console.info('✔️ Subscribed to Pages Spreadsheet')
  const pagesRef = database.ref(`/${spreadsheet}${client ? '/' + client : ''}`)
  pagesRef.on('value', snapshot => {
    const pages = snapshot.val()
    if (!pages) return
    const formattedPages = pages.filter(page => {
      if (every(Object.values(page), isEmpty)) return false // filter out empty pages
      return true
    }).map(page => {
      if (isEmpty(page.components) === false) {
        const rows = page.components.split('\n')
        page.components = rows.map(row => row.split(',').map(camelCase)) // convert to camelCase to match mapped components
      }
      return page
    })
    const value = JSON.stringify(formattedPages)
    self.postMessage({ action: 'pages', value })
  })
}
