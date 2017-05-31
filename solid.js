const idm = require('./helpers/idm.js')
const http = require('./helpers/http.js')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = function(RED) {
  function SolidExport(config) {
    RED.nodes.createNode(this, config)

    const { url, delegator } = config
    const node = this
    let credentials

    idm.getCredentials().then(creds => {
      credentials = creds
    }).catch(e => {
      node.error(e) 
    })
  
    this.on('input', (msg) => {
      if (!credentials || !url || !delegator)
        return 

      http.checkIfExists(url, credentials, delegator).then(exists => {
        if (exists) {
          http.appendData(msg.payload, url, credentials, delegator)
        } else {
          http.initAcl(url, credentials, delegator)
          .then(http.initWithData(msg.payload, url, credentials, delegator))
        }
      })
    })
  }
  RED.nodes.registerType('solid-upload',SolidExport);
}
