const $rdf = require('rdflib')

const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const SSN = $rdf.Namespace('http://purl.oclc.org/net/ssnx/ssn#')
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/')
const DC = $rdf.Namespace('http://purl.org/dc/terms/')

module.exports = {
  wrapInRdf: (data, url) => {
    const g = $rdf.graph() 
    const sensorUri = url + '#sensor'
    const observationUrl = `${url}#${data.lastUpdated}`

    g.add($rdf.sym(sensorUri), SSN('madeObservation'), $rdf.sym(observationUrl)) 
    g.add($rdf.sym(observationUrl), RDF('type'), SSN('Observation')) 
    g.add($rdf.sym(observationUrl), SSN('observationResult'), $rdf.lit(data.value)) 
    g.add($rdf.sym(observationUrl), SSN('observationTime'), $rdf.lit(data.lastUpdated)) 

    return $rdf.serialize(undefined, g, undefined, 'text/turtle')
  },

  rdfFileBoilerplate: (data, url) => {
    const g = $rdf.graph() 
    const sensorUri = `${url}#sensor`

    g.add($rdf.sym(url), RDF('type'), FOAF('Document'))
    g.add($rdf.sym(url), DC('title'), $rdf.lit('Sensor Data'))
    g.add($rdf.sym(url), FOAF('primaryTopic'), $rdf.sym(sensorUri))

    g.add($rdf.sym(sensorUri), RDF('type'), SSN('Sensor'))
    g.add($rdf.sym(sensorUri), SSN('observes'), $rdf.lit('Temp in C'))

    g.add($rdf.sym(`${url}${data.lastUpdated}`), RDF('type'), SSN('Observation'))
    g.add($rdf.sym(`${url}${data.lastUpdated}`), SSN('observationResult'), $rdf.lit(data.value))
    g.add($rdf.sym(`${url}${data.lastUpdated}`), SSN('observationTime'), $rdf.lit(data.lastUpdated))

    return $rdf.serialize(undefined, g, undefined, 'text/turtle')
  }
}
