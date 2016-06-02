import jsonld from 'jsonld'

var idCounter = 0

export const context = {
  "dcterms": "http://purl.org/dc/terms/",
  "editor": "http://lblod.github.io/editor/assets/editor.json#",
  "people": "http://lblod.github.io/editor/assets/people.json#",
  "foaf": "http://xmlns.com/foaf/0.1/",
  "gemeente": "http://codex.vlaanderen.be/Zoeken/Document.aspx?DID=1013949&param=inhoud&AID=",
  "hydra": "http://www.w3.org/ns/hydra/core#",
  "kies": "http://codex.vlaanderen.be/Zoeken/Document.aspx?DID=1020561&param=inhoud&AID=",
  "lbld": "http://decisions.data.vlaanderen.be/ns#",
  "mandaat": "http://mandates.data.vlaanderen.be/ns#",
  "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
  "schema": "http://schema.org/",
  "skos": "http://www.w3.org/2004/02/skos/core#",
  "void": "http://rdfs.org/ns/void#",
  "xsd": "http://www.w3.org/2001/XMLSchema#"
}

const vocabContext = [{
  "@id": "dcterms:spatial",
  "@type": "rdf:Property",
  "rdfs:label": {
    "@language": "en",
    "@value": "Spatial Coverage"
  },
  range: ['text', 'geojson']
}, {
  "@id": "dcterms:temporal",
  "@type": "rdf:Property",
  "rdfs:label": {
    "@language": "en",
    "@value": "Temporal Coverage"
  },
  range: ['text', 'dcterms:PeriodOfTime']
}, {
  "@id": "lbld:replaces",
  "@type": "rdf:Property",
  range: ['lbld:Article'],
  "rdfs:label": {
    "@language": "en",
    "@value": "Replaces"
  }
}]

const fragments = []

export default {
  data () {
    return {
      context: vocabContext,
      fragments: fragments
    }
  },
  computed: {
    map () {
      var map = {}
      for (var i = 0; i < this.fragments.length; i++) {
        map[this.fragments[i].id] = this.fragments[i]
        if (this.fragments[i]['lbld:alternate']) {
          map[this.fragments[i]['lbld:alternate']] = this.fragments[i]
        }
      }
      for (var i = 0; i < this.props.length; i++) {
        map[this.props[i]['@id']] = this.props[i]
      }
      console.log('fragments', Object.keys(map).length, 'props', this.props.length)
      return map
    },
    props () {
      return this.context.filter(x => x['@type'] === 'rdf:Property')
    },
    orgaanOptions () {
      return this.fragments
      .filter(t => t.type === 'schema:OrganizationType')
      .map(t => {
        return {
          type: t.text,
          options: this.fragments.filter(o => o['lbld:type'] && o['lbld:type']['@id'] === t.id)
        }
      })
    }
  },
  methods: {
    load (url) {
      var self = this
      return this.$http.get(url).then(function ({data}) {
        if (!data || !data['@graph']) {
          throw 'This resource is not a graph'
        }

        // Set context
        jsonld.compact(data, context, function(err, compacted) {
          for (var i = compacted['@graph'].length - 1; i >= 0; i--) {
            let f = compacted['@graph'][i]

            // Generate missing ids
            if (!f['@id']) {
              f['@id'] = 'editor:' + idCounter++
            }

            // Shorthands
            f.id = f['@id']
            f.text = f['schema:name'] || f['dcterms:title'] || f['dcterms:description']
            f.type = f['@type']

            // Save only in array (map is generated)
            self.fragments.push(f)
          }
          console.log('got', fragments.length, 'fragments')
        })
      })
    },
    mapGet (uri) {
      if (typeof uri === 'object') {
        uri = uri['@id'] || uri.id
      }
      if (!uri) {
        return {}
      }
      return this.map[uri] || {}
    }
  },
  ready () {
    this.load('./assets/editor.json')
    // These are the initial mandates
    // this.load('./assets/mandates.json')
    this.load('./assets/gemeentedecreet.json')
    this.load('./assets/people.json')
    this.load('http://linkeddatatestagiv.cloudapp.net/poc/decisions.jsonld?limit=100000').catch(function () {
      this.load('./assets/example.json')
    })
  }
}