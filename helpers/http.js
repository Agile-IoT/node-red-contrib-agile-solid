const request = require('request')
const rdf = require('./rdf.js')

module.exports = {

  checkIfExists: (url, credentials) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'HEAD',
        url: url,
        cert: credentials.certFile,
        key: credentials.keyFile
      }

      return request(options, (err, res) => {
        if (err) resolve(false)
        resolve(res.statusCode === 200)
      })
    })
  },

  initWithData: (data, url, credentials, node) => {
    const body = rdf.rdfFileBoilerplate(data, url)
    request({
      method: "PUT",
      url: url,
      body: body,
      cert: credentials.certFile,
      key: credentials.keyFile,
    })
  },

  appendData: (data, url, credentials) => {
    const query = rdf.wrapInRdf(data, url)
    request({
      method: "PATCH",
      url: url,
      body: `INSERT DATA { ${query} };`,
      cert: credentials.certFile,
      key: credentials.keyFile,
      headers: {
        'Content-Type': 'application/sparql-update'
      }
    })
  }
}
