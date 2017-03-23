const fs = require('fs')

module.exports = {
  // @TODO These will have to come from the IDM.
  getCredentials: () => {
    // const path = '//fuchs/.node-red/nodes/'
    const path = '/tmp/'
    let credentials = {}

    try {
      credentials.certFile = fs.readFileSync(`${path}cert.pem`, 'utf8')
      credentials.keyFile = fs.readFileSync(`${path}key.pem`, 'utf8')
    } catch (e) {
      credentials = undefined
    }

    return credentials 
  }
}
