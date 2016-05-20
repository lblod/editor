export default {
  computed: {
    map () {
      var map = {}
      for (var i = 0; i < this.fragments.length; i++) {
        if (!this.fragments[i].id) {
          this.fragments[i].id = this.fragments[i]['@id'] || ('_:' + i)
        }
        if (!this.fragments[i].text) {
          this.fragments[i].text = this.fragments[i]['schema:name']
        }
        map[this.fragments[i].id] = this.fragments[i]
      }
      console.log('fragments', Object.keys(map).length)
      for (var i = 0; i < this.props.length; i++) {
        map[this.props[i]['@id']] = this.props[i]
      }
      console.log('props', this.props.length)
      return map
    },
    props () {
      return this.context.filter(x => x['@type'] === 'rdf:Property')
    }
  },
  data () {
    return {
      context: [{
        "@id": "dcterms:spatial",
        "@type": "rdf:Property",
        "rdfs:label": {
          "@language": "en",
          "@value": "Spatial Coverage"
        },
        "schema:rangeIncludes": {
          "@id": "rdfs:Literal"
        }
      }, {
        "@id": "dcterms:temporal",
        "@type": "rdf:Property",
        "rdfs:label": {
          "@language": "en",
          "@value": "Temporal Coverage"
        },
        "schema:rangeIncludes": {
          "@id": "dcterms:PeriodOfTime"
        }
      }, {
        // Below is generated from lblod/vocabulary
        "@id": "http://decisions.data.vlaanderen.be/ns",
        "@type": "foaf:Document",
        "cc:license": {
          "@id": "http://creativecommons.org/licenses/by/3.0/"
        },
        "dct:hasFormat": {
          "@id": "https://raw.githubusercontent.com/decisions/vocabulary/master/lbld.ttl"
        },
        "dct:issued": {
          "@type": "xsd:date",
          "@value": "2016-03-14"
        },
        "dct:modified": {
          "@type": "xsd:date",
          "@value": "2016-05-09"
        },
        "dct:rights": "to do",
        "foaf:primaryTopic": {
          "@id": "lbld:Vocabulary"
        }
      }, {
        "@id": "lbld:Article",
        "@type": "rdfs:Class",
        "rdfs:comment": {
          "@language": "en",
          "@value": "An article is a formalization of a decision"
        },
        "rdfs:label": {
          "@language": "en",
          "@value": "Article"
        },
        "status:term_status": {
          "@language": "en",
          "@value": "unstable"
        }
      }, {
        "@id": "lbld:Decision",
        "@type": "rdfs:Class",
        "rdfs:comment": [
          {
            "@language": "en",
            "@value": "A decision is a motion that has passed an official board"
          },
          {
            "@language": "nl",
            "@value": "Een besluit is een agendapunt dat een bepaald goedkeuringsproces doorliep"
          }
        ],
        "rdfs:label": {
          "@language": "en",
          "@value": "Decision"
        },
        "rdfs:subClassOf": {
          "@id": "dcat:Distribution"
        },
        "status:term_status": {
          "@language": "en",
          "@value": "unstable"
        }
      }, {
        "@id": "lbld:Motivation",
        "@type": "rdfs:Class",
        "rdfs:comment": {
          "@language": "en",
          "@value": "A motivation for a taken decision"
        },
        "rdfs:label": {
          "@language": "en",
          "@value": "Motivation"
        },
        "status:term_status": {
          "@language": "en",
          "@value": "unstable"
        }
      }, {
        "@id": "lbld:Ontology",
        "@type": "owl:Ontology",
        "dct:creator": {
          "@id": "http://pieter.pm/#me"
        },
        "dct:description": {
          "@language": "en",
          "@value": "Small vocabulary to describe decisions inspired by DCAT."
        },
        "vann:preferredNamespacePrefix": "lbld",
        "vann:preferredNamespaceUri": "http://decisions.data.vlaanderen.be/ns#",
        "rdfs:label": {
          "@language": "en",
          "@value": "Local Decision as Linked Open Data"
        },
        "rdfs:seeAlso": {
          "@id": "https://github.com/lbld/vocabulary"
        }
      }, {
        "@id": "lbld:bbcCode",
        "@type": "rdf:Property",
        "rdfs:comment": {
          "@language": "en",
          "@value": ""
        },
        "rdfs:label": {
          "@language": "en",
          "@value": "BBC Code"
        },
        "status:term_status": {
          "@language": "en",
          "@value": "unstable"
        }
      }, {
        "@id": "lbld:changes",
        "@type": "rdf:Property",
        "rdfs:comment": {
          "@language": "en",
          "@value": ""
        },
        "rdfs:label": {
          "@language": "en",
          "@value": "Changes"
        },
        "status:term_status": {
          "@language": "en",
          "@value": "unstable"
        }
      }, {
        "@id": "lbld:legalBackground",
        "@type": "rdf:Property",
        "rdfs:comment": {
          "@language": "en",
          "@value": ""
        },
        "rdfs:label": {
          "@language": "en",
          "@value": "Legal background"
        },
        "status:term_status": {
          "@language": "en",
          "@value": "unstable"
        }
      }, {
        "@id": "lbld:replaces",
        "@type": "rdf:Property",
        "rdfs:comment": {
          "@language": "en",
          "@value": ""
        },
        "rdfs:label": {
          "@language": "en",
          "@value": "Replaces"
        },
        "status:term_status": {
          "@language": "en",
          "@value": "unstable"
        }
      }, {
        "@id": "lbld:responsibleFor",
        "@type": "rdf:Property",
        "rdfs:comment": {
          "@language": "en",
          "@value": "A linked article to indicate the decision making organisation is responsible for this matter"
        },
        "rdfs:label": {
          "@language": "en",
          "@value": "Responsible for"
        },
        "status:term_status": {
          "@language": "en",
          "@value": "unstable"
        }
      }, {
        "@id": "http://eurovoc.europa.eu/2629",
        "rdfs:label": {
          "@language": "en",
          "@value": "decision-making"
        },
        "skos:exactMatch": [
          {
            "@id": "http://www.eionet.europa.eu/gemet/concept/2009"
          },
          {
            "@id": "http://lib-thesaurus.un.org/LIB/DHLUNBISThesaurus.nsf/fee3fb01c865ac5d85256cf400648b1f/ed5631efc48f9ff785256aa0005fedd4"
          },
          {
            "@id": "http://ec.europa.eu/eclas/euc11/000004323"
          }
        ],
        "skos:related": {
          "@id": "http://eurovoc.europa.eu/2580"
        }
      }, {
        "@id": "http://pieter.pm/#me",
        "foaf:mbox": "Pieter.Colpaert@UGent.be",
        "foaf:name": "Pieter Colpaert"
      }],
      fragments: [{
        id: '_:decision-136#1',
        text: 'Besluit 136 artikel 1'
      }, {
        id: '_:decision-136#2',
        text: 'Besluit 136 artikel 2'
      }, {
        id: '_:legislatuur-15397',
        text: 'Legislatuur Sanders 2013-heden'
      }, {
        id: '_:legislatuur-13502',
        text: 'Legislatuur Kennedy 2010-2014'
      }, {
        id: '_:decision-136#3',
        text: 'Besluit 136 artikel 3'
      }, {
        id: '_:decision-136#4',
        text: 'Besluit 136 artikel 4'
      }, {
        id: '_:decision-120#1',
        text: 'Besluit 120 artikel 1'
      }, {
        id: '_:decision-79#1',
        text: 'Besluit 79 artikel 1'
      }, {
        id: '_:kiesdecreet',
        text: 'Kiesdecreet'
      }, {
        id: '_:gemeentedecreet',
        text: 'Gemeentedecreet'
      }, {
        id: '_:gemeentedecreet#43',
        text: 'Gemeentedecreet artikel 43'
      }, {
        id: '_:gemeentedecreet#42',
        text: 'Gemeentedecreet artikel 42'
      }, {
        id: '_:decision-79#1',
        text: 'Besluit 79 artikel 1'
      }, {
        id: '_:decision-79#1',
        text: 'Besluit 79 artikel 1'
      }, {
        '@type': 'schema:Person',
        'schema:name': 'Mattias Vandemaele'
      }, {
        '@type': 'schema:Person',
        'schema:name': 'Petra Verhenne'
      }, {
        '@type': 'schema:Person',
        'schema:name': 'Stijn Vanneste'
      }, {
        '@type': 'schema:Person',
        'schema:name': 'Annelies Vandendriesche'
      }, {
        '@type': 'schema:Organisation',
        'schema:name': 'Kortrijk'
      }, {
        '@type': 'schema:Person',
        'schema:name': 'Geert Van Kazenberg'
      }, {
        '@type': 'schema:Person',
        'schema:name': 'Jan Vansteenlandt'
      }, {
        '@type': 'schema:Person',
        'schema:name': 'Ingrid Willems'
      }]
    }
  }
}