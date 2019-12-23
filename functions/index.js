const admin = require('firebase-admin')
const functions = require('firebase-functions').region('europe-west1')

admin.initializeApp()

exports.authenticate = functions.https.onCall(data => {
  console.info('authentication data', data)
  const { client, password, spreadsheet } = data
  const leafs = admin.database().ref(`/${spreadsheet}/Leafs`)
  return new Promise((resolve, reject) => {
    leafs.on('value', snapshot => {
      const value = snapshot.val()
      if (typeof value === 'object') {
        console.info(client, password, value)
        return resolve(value)
      } else {
        reject(new Error('No leaf 🍂'))
      }
    })
  })
})
