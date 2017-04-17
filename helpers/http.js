const request = require('request')
const rdf = require('./rdf.js')

module.exports = {

  checkIfExists: (url, credentials, delegator) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'HEAD',
        url: url,
        cert: credentials.cert,
        key: credentials.key,
        headers: {
          'on-behalf-of': delegator
        }
      }

      return request(options, (err, res) => {
        if (err) return resolve(false)
        return resolve(res.statusCode === 200)
      })
    })
  },

  initAcl: (url, credentials, delegator) => {
    return new Promise((resolve, reject) => {
      const body = rdf.aclFileBoilerplate(url, delegator)
      request({
        method: "PUT",
        url: `${url}.acl`,
        body: body,
        cert: credentials.cert,
        key: credentials.key,
        headers: {
          'on-behalf-of': delegator
        }
      }, (err, res) => {
        if(err) {
          return reject() 
        }
        return resolve()
      })
    })
  },

  initWithData: (data, url, credentials, delegator) => {
    const body = rdf.rdfFileBoilerplate(data, url)
    request({
      method: "PUT",
      url: url,
      body: body,
      cert: credentials.cert,
      key: credentials.key,
      headers: {
        'on-behalf-of': delegator
      }
    }, (err, res) => {
    })
  },

  addSinkToIndex: (credentials, url) => {
    const fullGwWebId = `https://${credentials.gwWebId}/profile/card#me`
    const query = rdf.addSinkQuery(fullGwWebId, url)
    request({
      method: "PATCH",
      url: fullGwWebId,
      body: `INSERT DATA { ${query} };`,
      cert: credentials.cert,
      key: credentials.key,
      headers: {
        'Content-Type': 'application/sparql-update'
      }
    })
  },

  appendData: (data, url, credentials, delegator) => {
    const query = rdf.wrapInRdf(data, url)
    request({
      method: "PATCH",
      url: url,
      body: `INSERT DATA { ${query} };`,
      cert: credentials.cert,
      key: credentials.key,
      headers: {
        'on-behalf-of': delegator,
        'Content-Type': 'application/sparql-update'
      }
    })
  }
}
