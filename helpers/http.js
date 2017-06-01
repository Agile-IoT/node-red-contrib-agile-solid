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

      return request(options, (error, resolve) => {
        if (error)
          return resolve(false)
        return resolve(res.statusCode === 200)
      }).on('error', e => reject)
    })
  },

  initAcl: (url, credentials, delegator) => {
    return new Promise((resolve, reject) => {
      const body = rdf.aclFileBoilerplate(url, delegator)
      const options = {
        method: "PUT",
        url: `${url}.acl`,
        body: body,
        cert: credentials.cert,
        key: credentials.key,
        headers: {
          'on-behalf-of': delegator
        }
      }

      request(options, (err, res) => {
        if(err || res.statusCode !== 200)
          return reject() 

        return resolve()
      }).on('error', e => reject)
    })
  },

  initWithData: (data, url, credentials, delegator) => {
    return new Promise((resolve, reject) => {
      const body = rdf.rdfFileBoilerplate(data, url)
      const options = {
        method: "PUT",
        url: url,
        body: body,
        cert: credentials.cert,
        key: credentials.key,
        headers: {
          'on-behalf-of': delegator
        }
      }

      request(options, (error, response) => {
        if (error || response.statusCode !==  200)
          return reject(response.statusCode)

        return resolve()
      }).on('error', e => reject)
    })
  },

  appendData: (data, url, credentials, delegator) => {
    return new Promise((resolve, reject) => {
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
      }, (error, response) => {
        if (error || response.statusCode !== 200)
          return reject()

        return resolve()
      }).on('error', e => reject)
    })
  }
}
