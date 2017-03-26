const idm = require('./helpers/idm.js')
const http = require('./helpers/http.js')

module.exports = function(RED) {
  function SolidExport(config) {
    RED.nodes.createNode(this, config)
    const { url, delegate, delegator } = config
    const node = this
    let credentials

    idm.getCredentials().then(creds => {
      credentials = creds
    })
  
    this.on('input', (msg) => {
      if (!credentials || !url || !delegator) {
        return 
      }

      http.checkIfExists(url, credentials, delegate, delegator).then(exists => {
        if (exists) {
          http.appendData(msg, url, credentials, delegate, delegator)
        } else {
          http.addSinkToIndex(credentials, url)
          http.initWithData(msg, url, credentials, delegate, delegator)
        }
      })
    })
  }
  RED.nodes.registerType('solid-upload',SolidExport);
}
