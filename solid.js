const util = require('./helpers/util.js')
const http = require('./helpers/http.js')

module.exports = function(RED) {
  function SolidExport(config) {
    RED.nodes.createNode(this, config)
    const { url, delegate, delegator } = config
    const node = this
    const credentials = util.getCredentials()

  
    this.on('input', (msg) => {
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
