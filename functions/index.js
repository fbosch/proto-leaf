const admin = require('firebase-admin')
const functions = require('firebase-functions').region('europe-west1')

admin.initializeApp()
const database = admin.database()

exports.authenticate = functions.https.onCall(data => {
  const { client, password, spreadsheet } = data
  const leafs = database.ref(`/${spreadsheet}/Leafs`)
  const blacklist = ['password', 'url']
  return new Promise((resolve, reject) => {
    function handleAuthentication (snapshot) {
      const value = snapshot.val()
      if (value) {
        let values = value.filter(Boolean)
          .map(clientItem => {
            clientItem.leaf = clientItem.leaf.toLowerCase()
            return clientItem
          })
        const clientData = values.find(clientItem => clientItem && clientItem.leaf === client.toLowerCase())
        const isPasswordProtected = clientData && clientData.password && clientData.password.toString() !== ''
        if (isPasswordProtected && clientData.password.toString() === password.toString()) {
          values = values.map(clientItem => {
            Object.keys(clientItem)
              .filter(key => blacklist.includes(key))
              .forEach(key => {
                delete clientItem[key]
              })
            return clientItem
          })
          resolve({ ...clientData, leafs: values })
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
