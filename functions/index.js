const admin = require('firebase-admin')
const functions = require('firebase-functions').region('europe-west1')

admin.initializeApp()
const database = admin.database()

exports.authenticate = functions.https.onCall(data => {
  const { client, password, spreadsheet } = data
  const leafs = database.ref(`/${spreadsheet}/Leafs`)

  return new Promise((resolve, reject) => {
    function handleAuthentication (snapshot) {
      const value = snapshot.val()
      if (typeof value === 'object') {
        const clientData = value.filter(Boolean).find(clientItem => clientItem && clientItem.leaf.toLowerCase() === client.toLowerCase())
        const isPasswordProtected = clientData && clientData.password && clientData.password.toString() !== ''
        if (isPasswordProtected && clientData.password.toString() === password.toString()) {
          delete clientData.password
          delete clientData.url
          resolve(clientData)
        }
        resolve(null)
      } else {
        reject(new Error('No leaf 🍂'))
      }
      leafs.off('value', handleAuthentication)
    }
    leafs.on('value', handleAuthentication)
  })
})
