/*******************************************************************************
 *Copyright (C) 2017 Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    Jolocom - initial API and implementation
 ******************************************************************************/
const request = require('request')
const rdf = require('./rdf.js')
const x509 = require('x509')

const tokenEndpoint = 'http://192.168.0.24:3000/oauth2/token';
const userInfoEndpoint = 'http://192.168.0.24:3000/oauth2/api/userinfo';

const _getToken = () => {
  return new Promise((resolve, reject) => {
    const credentials = 'JolocomDemoApplication:agilegraz';
    const buff = new Buffer(credentials).toString('base64');
    const auth = 'Basic ' + buff;

    return request({
      method : 'POST',
      url : 'http://192.168.0.24:3000/oauth2/token',
      form: {
        grant_type:'client_credentials'
      },
      headers : {
        'Authorization' : auth
      }
    }, (err, res, body) => {
      if (err) {
        reject(err);
      }

      try {
        return resolve(JSON.parse(body).access_token)
      } catch(e) {
        return reject(body) 
      }
    })
  })
}

const _getUserId = (token) => {
  return new Promise((resolve, reject) => {
    request({
      method : 'GET',
      url : 'http://192.168.0.24:3000/oauth2/api/userinfo',
      headers : {
        'Authorization' : 'Bearer ' + token
      }
    }, (err, res, body) => {
      if (err) {
        return reject(err);
      }

      try {
        const { user_name, auth_type } = JSON.parse(body);
        return resolve({ user_name, auth_type });
      } catch(e) {
        return reject(body) 
      }
    })
  })
}

_getUserInfo = (token, id) => {
  return new Promise((resolve, reject) => {
    const {user_name, auth_type} = id

    return request({
      method : 'GET',
      url :  `http://192.168.0.24:3000/api/v1/user/?user_name=${user_name}&auth_type=${auth_type}`,
      headers : {
        'Authorization' : 'Bearer ' + token
      }
    }, (err, res, body) => {
      if (err) {
        return reject(err);
      }

      try {
        const { cert, key } = JSON.parse(body)
        const gwWebId = x509.getSubject(cert).commonName

        return resolve({cert, key, gwWebId})
      } catch(e) {
        return reject(body) 
      }
    })
  })
}

module.exports = {
  getCredentials: () => {
    return _getToken().then(token => {
      return _getUserId(token).then(id => {
        return _getUserInfo(token, id)  
      })
    })
  }
}
