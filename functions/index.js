const admin = require('firebase-admin')
const functions = require('firebase-functions').region('europe-west1')

admin.initializeApp()
const database = admin.database()

exports.authenticate = functions.https.onCall(data => {
  const { client, password, spreadsheet } = data
  const leafs = database.ref(`/${spreadsheet}/Leafs`)
  return new Promise((resolve, reject) => {
    const handleAuthentication = snapshot => {
      const value = snapshot.val()
      if (typeof value === 'object') {
        const clientData = value.filter(Boolean).find(clientItem => clientItem.leaf === client)
        const isPasswordProtected = clientData && clientData.password && clientData.password.toString() !== ''
        if (isPasswordProtected && clientData.password.toString() === password.toString()) {
          delete clientData.password
          delete clientData.id
          delete clientData.leaf
          leafs.off(handleAuthentication)
          return resolve(clientData)
        }
        leafs.off(handleAuthentication)
        return resolve(null)
      } else {
        leafs.off(handleAuthentication)
        reject(new Error('No leaf 🍂'))
      }
    }
    leafs.on('value', handleAuthentication)
  })
})
