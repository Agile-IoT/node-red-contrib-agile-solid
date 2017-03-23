const request = require('request')
const rdf = require('./rdf.js')

module.exports = {

  checkIfExists: (url, credentials, delegate, delegator) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'HEAD',
        url: url,
        cert: credentials.certFile,
        key: credentials.keyFile,
        headers: delegate ? {
          'on-behalf-of': delegator
        } : {}
      }

      return request(options, (err, res) => {
        if (err) resolve(false)
        resolve(res.statusCode === 200)
      })
    })
  },

  initWithData: (data, url, credentials, node, delegate, delegator) => {
    const body = rdf.rdfFileBoilerplate(data, url)
    request({
      method: "PUT",
      url: url,
      body: body,
      cert: credentials.certFile,
      key: credentials.keyFile,
      headers: delegate ? {
        'on-behalf-of': delegator
      } : {}
    })
  },

  appendData: (data, url, credentials, delegate, delegator) => {
    const query = rdf.wrapInRdf(data, url)
    request({
      method: "PATCH",
      url: url,
      body: `INSERT DATA { ${query} };`,
      cert: credentials.certFile,
      key: credentials.keyFile,
      headers: delegate ? {
        'on-behalf-of': delegator,
        'Content-Type': 'application/sparql-update'
      } : {
        'Content-Type': 'application/sparql-update'
      }
    })
  }
}
