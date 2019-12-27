const admin = require('firebase-admin')
const functions = require('firebase-functions').region('europe-west1')

admin.initializeApp()
const database = admin.database()

exports.authenticate = functions.https.onCall(data => {
  const { client, password, spreadsheet } = data
  const leafs = database.ref(`/${spreadsheet}/Leafs`)
  const whitelist = ['id', 'name', 'leaf']
  return new Promise((resolve, reject) => {
    leafs.on('value', handleAuthentication)
    function handleAuthentication (snapshot) {
      const value = snapshot.val()
      if (value) {
        let values = value.filter(Boolean)
        const clientData = values.find(clientItem => clientItem && clientItem.leaf && clientItem.leaf.toLowerCase() === client.toLowerCase())
        if (clientData) {
          // remove blacklisted keys to prevent them from getting sent to the client (such as passwords)
          if (clientData.password) {
            if (clientData.password === password) {
              values = values.map(clientItem => {
                Object.keys(clientItem)
                  .filter(key => !whitelist.includes(key))
                  .forEach(key => {
                    delete clientItem[key]
                  })
                return clientItem
              })
              resolve({ ...clientData, leafs: values })
            } else {
              resolve(null)
            }
          } else {
            resolve({ ...clientData, leafs: values })
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
