const util = require('./helpers/util.js')
const http = require('./helpers/http.js')

module.exports = function(RED) {
  function SolidExport(config) {
    RED.nodes.createNode(this, config)
    const url = config.target
    const node = this
    const credentials = util.getCredentials()

    this.on('input', (msg) => {
      http.checkIfExists(url, credentials).then(exists => {
        if (exists) {
          http.appendData(msg, url, credentials)
        } else {
          http.initWithData(msg, url, credentials)
        }
      })
    })
  }
  RED.nodes.registerType('solid-upload',SolidExport);
}
