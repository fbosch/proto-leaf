// const admin = require('firebase-admin')
const functions = require('firebase-functions').region('europe-west1')

exports.authenticate = functions.https.onCall((req, res) => {
  if (req) {
    res.send('Hello')
  }
})
