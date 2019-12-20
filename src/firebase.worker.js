/* eslint-env worker */
// TODO: get firebase dependencies from CDN
import '@firebase/database'

import { camelCase, every, isEmpty, omit, omitBy } from 'lodash'

import firebase from '@firebase/app'

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

firebase.initializeApp(config)
const database = firebase.database()
const spreadsheet = process.env.SPREADSHEET_ID

self.addEventListener('message', event => {
  const { action, ...rest } = event.data
  switch (action) {
    case 'components': return subscribeToComponents()
    case 'pages': return subscribeToPages(rest)
  }
})

function subscribeToComponents () {
  const unusedProperties = ['description', 'type', 'component', 'category']
  const componentsRef = database.ref(`/${spreadsheet}/Components`)
  componentsRef.on('value', snapshot => {
    const components = snapshot.val()
    const formattedComponets = Object.keys(components)
      .reduce((accum, component) => ({
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
  const pagesRef = database.ref(`/${spreadsheet}${client ? '/' + client : ''}`)
  pagesRef.on('value', snapshot => {
    const pages = snapshot.val()
      .filter(page => {
        if (every(Object.values(page), isEmpty)) return false // filter out empty pages
        return true
      })
      .map(page => {
        if (isEmpty(page.components) === false) {
          const rows = page.components.split('\n')
          page.components = rows.map(row => row.split(',').map(camelCase)) // convert to camelCase to match mapped components
        }
        return page
      })
    const value = JSON.stringify(pages)
    self.postMessage({ action: 'pages', value })
  })
}
