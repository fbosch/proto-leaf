import '@firebase/database'

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

export default {
  spreadsheet: client => database.ref(`/${spreadsheet}${client ? '/' + client : ''}`),
  components: () => database.ref(`/${spreadsheet}/Components`)
}
