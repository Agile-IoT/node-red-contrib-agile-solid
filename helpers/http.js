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
        if (err)
          return resolve(false)
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
        if(err || res.statusCode !== 200)
          return reject() 

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
    }, (error, response) => {
      if (error || response.statusCode !==  200)
        console.error(response.statusCode)
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
    }, (error, response) => {
      if (error || response.statusCode !== 200)
        console.error(response.statusCode)
    }).on('error', e => {
      console.error(e)
    })
  }
}
