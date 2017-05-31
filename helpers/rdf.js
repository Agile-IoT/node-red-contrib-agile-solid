const $rdf = require('rdflib')

const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const SSN = $rdf.Namespace('http://purl.oclc.org/net/ssnx/ssn#')
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/')
const DC = $rdf.Namespace('http://purl.org/dc/terms/')
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#')

module.exports = {
  aclFileBoilerplate: (url, delegator) => {
    const g = $rdf.graph() 
    const aclUrl = $rdf.sym(`${url}.acl#owner`)

    g.add(aclUrl, RDF('type'), ACL('Authorization'));
    g.add(aclUrl, ACL('accessTo'), $rdf.sym(url));
    g.add(aclUrl, ACL('agent'), $rdf.sym(delegator));

    g.add(aclUrl, ACL('mode'), ACL('Read'));
    g.add(aclUrl, ACL('mode'), ACL('Write'));
    g.add(aclUrl, ACL('mode'), ACL('Control'));
    
    return $rdf.serialize(undefined, g, undefined, 'text/turtle')
  },

  /*
   * data is expected to be a RecordObject
   * see http://agile-iot.github.io/agile-api-spec/docs/html/api.html#RecordObject
   */

  wrapInRdf: (data, url) => {
    const g = $rdf.graph() 
    const sensorUri = url + '#sensor'
    const observationUrl = `${url}#${data.LastUpdated}`
    g.add($rdf.sym(sensorUri), SSN('madeObservation'), $rdf.sym(observationUrl)) 
    g.add($rdf.sym(observationUrl), RDF('type'), SSN('Observation')) 
    g.add($rdf.sym(observationUrl), SSN('observationResult'), $rdf.lit(data.Value)) 
    g.add($rdf.sym(observationUrl), SSN('observationTime'), $rdf.lit(data.LastUpdated)) 

    return $rdf.serialize(undefined, g, undefined, 'text/turtle')
  },

  rdfFileBoilerplate: (data, url) => {
    const g = $rdf.graph() 
    const sensorUri = `${url}#sensor`

    g.add($rdf.sym(url), RDF('type'), FOAF('Document'))
    g.add($rdf.sym(url), DC('title'), $rdf.lit('Sensor Data'))
    g.add($rdf.sym(url), FOAF('primaryTopic'), $rdf.sym(sensorUri))

    g.add($rdf.sym(sensorUri), RDF('type'), SSN('Sensor'))
    g.add($rdf.sym(sensorUri), SSN('observes'), $rdf.lit(data.Unit))

    g.add($rdf.sym(`${url}${data.LastUpdated}`), RDF('type'), SSN('Observation'))
    g.add($rdf.sym(`${url}${data.LastUpdated}`), SSN('observationResult'), $rdf.lit(data.Value))
    g.add($rdf.sym(`${url}${data.LastUpdated}`), SSN('observationTime'), $rdf.lit(data.LastUpdated))

    return $rdf.serialize(undefined, g, undefined, 'text/turtle')
  }

  /*
  addSinkQuery: (webId, sink) => {
    const NIC = $rdf.Namespace('http://www.w3.org/ns/pim/space#')

    const g = $rdf.graph() 
    g.add($rdf.sym(webId), NIC('storage'), $rdf.sym(sink))

    return $rdf.serialize(undefined, g, undefined, 'text/turtle')
  }
  */
}
