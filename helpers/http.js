/*******************************************************************************
 *Copyright (C) 2017 Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License 2.0
 *which accompanies this distribution, and is available at
 *https://www.eclipse.org/legal/epl-2.0/
 *
 *SPDX-License-Identifier: EPL-2.0
 *
 *Contributors:
 *    Jolocom - initial API and implementation
 ******************************************************************************/
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

      return request(options, (error, response) => {
        if (error)
          return resolve(false)
        return resolve(response.statusCode === 200)
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

      request(options, (error, response) => {
        if(error || response.statusCode !== 201)
          return reject(error || response.statusCode) 

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
        if (error || response.statusCode !==  201)
          return reject(error || response.statusCode)

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
          return reject(error || response.statusCode)

        return resolve()
      }).on('error', e => reject)
    })
  }
}
