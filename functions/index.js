const admin = require('firebase-admin')
const functions = require('firebase-functions').region('europe-west1')

admin.initializeApp()
const database = admin.database()

exports.authenticate = functions.https.onCall(data => {
  const { client, password, spreadsheet } = data
  const leafs = database.ref(`/${spreadsheet}/Leafs`)
  const whitelist = ['id', 'name', 'leaf', 'password']
  return new Promise((resolve, reject) => {
    leafs.on('value', handleAuthentication)
    function handleAuthentication (snapshot) {
      const value = snapshot.val()
      if (value) {
        const values = value.filter(Boolean).map(clientItem => {
          const hasExternalSpreadsheet = clientItem.spreadsheet.length > 0
          const hasExternalComponents = clientItem.components.length > 0
          Object.keys(clientItem)
            .filter(key => !whitelist.includes(key))
            .forEach(key => {
              delete clientItem[key]
            })
          return { ...clientItem, hasExternalSpreadsheet, hasExternalComponents }
        })
        const clientData = values.find(clientItem => clientItem && clientItem.leaf && clientItem.leaf.toLowerCase() === client.toLowerCase())
        if (clientData) {
          // remove blacklisted keys to prevent them from getting sent to the client (such as passwords)
          if (clientData.password) {
            if (clientData.password === password) {
              delete clientData.password
              resolve(clientData)
            } else {
              resolve(null)
            }
          } else {
            resolve(clientData)
          }
        }
        resolve(null)
      } else {
        reject(new Error('No leaf 🍂'))
      }
      leafs.off('value', handleAuthentication)
    }
  })
})
