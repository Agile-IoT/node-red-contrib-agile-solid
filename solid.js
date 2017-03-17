const fs = require('fs')
const request = require('request')

module.exports = function(RED) {
  function SolidExport(config) {
    RED.nodes.createNode(this, config)
    const dst = config.target
    const node = this
    const credentials = {
      certFile: null,
      keyFile: null
    }

    // This will have to come from the IDM
    try {
      credentials.certFile = fs.readFileSync('/home/eugeniu/.node-red/nodes/cert.pem', 'utf8')
      credentials.keyFile = fs.readFileSync('/home/eugeniu/.node-red/nodes/key.pem', 'utf8')
    } catch (e) {
      msg.payload = e
      node.send(msg)
    }

    this.on('input', (msg) => {
      _checkExistance(dst, credentials).then(exists => {
        if (exists) {
          _appendData(msg.payload, dst, credentials)
        } else {
          _appendData(msg.payload, dst, credentials)
        }
      })
    })
  }
  RED.nodes.registerType('solid-upload',SolidExport);
}


// HELPER FUNCTIONS
// @TODO abstract into different file / class

_checkExistance = (dst, credentials) => {
  const options = {
    method: 'HEAD',
    url: dst,
    cert: credentials.certFile,
    key: credentials.keyFile
  }

  request(options, (err, res) => {
    if (err) return false 
    return res.statusCode === 200
  })
}

_initFile = (data, dst, credentials, node) => {
const body = `
  @prefix dc: <http://purl.org/dc/terms/> .
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .
  @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
  @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
  @prefix ssn: <http://purl.oclc.org/NET/ssnx/ssn#> .
  @prefix xml: <http://www.w3.org/XML/1998/namespace> .
  @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
  
  <> a foaf:Document ;
      dc:title "Sensor document" ;
      foaf:primaryTopic <#sensor> .
  
  <#sensor> a ssn:Sensor ;
      ssn:observes "Temperature in Celsius (initial)";
      ssn:madeObservation <#${data.lastUpdate}>.
  <#${data.lastUpdate}> a ssn:Observation;
    ssn:observationResult "${data.value}";
    ssn:observationTime "${data.lastUpdate}".
  `
  request({
    method: "PUT",
    url: dst,
    body: body,
    cert: credentials.certFile,
    key: credentials.keyFile,
  })
}

_appendData = (data, dst, credentials) => {
  const query = ` \
    INSERT DATA { \
      <${dst}#sensor> \
      <http://purl.oclc.org/NET/ssnx/ssn#madeObservation> \
      <${dst}#${data.lastUpdate}> . \
      <${dst}#${data.lastUpdate}> \
      <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> \
      <http://purl.oclc.org/NET/ssnx/ssn#Observation>. \
      <${dst}#${data.lastUpdate}> \
      <http://purl.oclc.org/NET/ssnx/ssn#observationResult> \
      "${data.value}" . \
      <${dst}#${data.lastUpdate}> \
      <http://purl.oclc.org/NET/ssnx/ssn#observationTime> \
      "${data.lastUpdate}".
    }; \
  `

  request({
    method: "PATCH",
    url: dst,
    body: query,
    cert: credentials.certFile,
    key: credentials.keyFile,
    headers: {
      'Content-Type': 'application/sparql-update'
    }
  })
}
