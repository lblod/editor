export default {
  computed: {
    map () {
      var map = {}
      for (var i = 0; i < this.fragments.length; i++) {
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
    },
    orgaanOptions () {
      return this.fragments
      .filter(t => t.type === 'lbld:OrgaanType')
      .map(t => {
        return {
          type: t.text,
          options: this.fragments.filter(o => o['lbld:type'] && o['lbld:type']['@id'] === t.id)
        }
      })
    }
  },
  methods: {
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
  data () {
    let data = {
      context: [{
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
        // Below is mostly generated from lblod/vocabulary
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
        range: ['text'],
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
        range: ['lbld:Article'],
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
        range: ['lbld:Article', 'lbld:Decision'],
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
        range: ['lbld:Article', 'lbld:Decision'],
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
        range: ['lbld:Orgaan'],
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
        type: 'lbld:Article',
        id: '_:decision-136#1',
        text: 'Besluit 136 artikel 1'
      }, {
        type: 'lbld:Article',
        id: '_:decision-136#2',
        text: 'Besluit 136 artikel 2'
      }, {
        type: 'lbld:Legislatuur',
        id: '_:legislatuur-15397',
        text: 'Legislatuur Sanders 2013-heden'
      }, {
        type: 'lbld:Legislatuur',
        id: '_:legislatuur-13502',
        text: 'Legislatuur Kennedy 2010-2014'
      }, {
        type: 'lbld:Article',
        id: '_:decision-136#3',
        text: 'Besluit 136 artikel 3'
      }, {
        type: 'lbld:Article',
        id: '_:decision-136#4',
        text: 'Besluit 136 artikel 4'
      }, {
        type: 'lbld:Article',
        id: '_:decision-120#1',
        text: 'Besluit 120 artikel 1'
      }, {
        type: 'lbld:Article',
        id: '_:decision-79#1',
        text: 'Besluit 79 artikel 1'
      }, {
        type: 'lbld:OrgaanType',
        id: '_:orgaan-gemeenteraad',
        text: 'Gemeenteraad'
      }, {
        type: 'lbld:OrgaanType',
        id: '_:orgaan-schepencollege',
        text: 'Schepencollege'
      }, {
        type: 'lbld:OrgaanType',
        id: '_:orgaan-districtsraad',
        text: 'Districtsraad'
      }, {
        type: 'lbld:Orgaan',
        id: '_:orgaan-gemeenteraad-kortrijk',
        text: 'Gemeenteraad Kortrijk',
        'lbld:type': {
          '@id': '_:orgaan-gemeenteraad'
        }
      }, {
        type: 'lbld:Orgaan',
        text: 'Gemeenteraad Scheveninge',
        'lbld:type': {
          '@id': '_:orgaan-gemeenteraad'
        }
      }, {
        type: 'lbld:Orgaan',
        text: 'Gemeenteraad Affligem',
        'lbld:type': {
          '@id': '_:orgaan-gemeenteraad'
        }
      }, {
        type: 'lbld:Orgaan',
        text: 'Gemeenteraad Roeselare',
        'lbld:type': {
          '@id': '_:orgaan-gemeenteraad'
        }
      }, {
        type: 'lbld:Orgaan',
        text: 'Voorbeeld Schepencollege',
        'lbld:type': {
          '@id': '_:orgaan-schepencollege'
        }
      }, {
        type: 'lbld:Orgaan',
        text: 'Voorbeeld Districtsraad',
        'lbld:type': {
          '@id': '_:orgaan-districtsraad'
        }
      }, {
        id: '_:zitting-1',
        type: 'lbld:Zitting',
        text: 'Zitting op 25 mei',
        date: '2016-05-25',
        'lbld:orgaan': {
          '@id': '_:orgaan-gemeenteraad-kortrijk'
        }
      }, {
        type: 'lbld:Zitting',
        text: 'Zitting op 23 maart',
        date: '2016-03-23',
        'lbld:orgaan': {
          '@id': '_:orgaan-gemeenteraad-kortrijk'
        }
      }, {
        type: 'lbld:Decision',
        id: '_:kiesdecreet',
        text: 'Kiesdecreet'
      }, {
        type: 'lbld:Decision',
        id: '_:gemeentedecreet',
        text: 'Gemeentedecreet'
      }, {
        type: 'lbld:Article',
        id: '_:gemeentedecreet#43',
        text: 'Gemeentedecreet artikel 43'
      }, {
        type: 'lbld:Article',
        id: '_:gemeentedecreet#42',
        text: 'Gemeentedecreet artikel 42'
      }, {
        type: 'lbld:Article',
        id: '_:gemeentedecreet#7.3',
        text: 'Gemeentedecreet artikel 7 §3'
      }, {
        type: 'lbld:Article',
        id: '_:decision-79#1',
        text: 'Besluit 79 artikel 1'
      }, {
        type: 'lbld:Article',
        id: '_:decision-79#1',
        text: 'Besluit 79 artikel 1'
      }, {
        '@type': 'schema:Person',
        'schema:name': 'Bart Caron'
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
        '@type': 'schema:Person',
        'schema:name': 'Geert Van Kazenberg'
      }, {
        '@type': 'schema:Person',
        'schema:name': 'Jan Vansteenlandt'
      }, {
        '@type': 'schema:Person',
        'schema:name': 'Ingrid Willems'
      }, {
        '@type': 'lbld:Decision',
        '@id': '_:decision-163',
        'dcterms:title': 'Gemeenteraad - Ontslag gemeenteraadslid - Aktename',
        'dcterms:abstract': null,
        'dcterms:spatial': null,
        'dcterms:temporal': null,
        'dcterms:topic': null,
        'dcterms:type': null,
        'lbld:legalBackground': null,
        'lbld:responsibleFor': null,
        'lbld:changes': null,
        'lbld:replaces': null,
        'lbld:responsibleFor': null,
        'lbld:zitting': {
          '@id': '_:zitting-1'
        },
        'schema:author': {
          '@type': 'schema:Person',
          'schema:name': 'Petra Verhenne'
        },
        'dcterms:description': 'Op 15 juni 2014 liet de heer Bart Caron weten dat hij ontslag neemt als gemeenteraadslid. In vervanging van de heer Bart Caron dient een opvolger geïnstalleerd te worden. De heer Mattias Vandemaele, eerste opvolger op de lijst Groen, is bereid het mandaat van gemeenteraadslid op te nemen in opvolging van de heer Bart Caron.',
        p: [{
          title: 'Aanleiding'
        }, {
          text: 'Op 15 juni 2014 liet de heer Bart Caron weten dat hij ontslag neemt als gemeenteraadslid. De gemeenteraad nam daarvan akte in huidige zitting.'
        }, {
          title: 'Motivatie',
          context: 'lbld:Motivation'
        }, {
          '@id': '_:decision-163-motivation#1',
          text: 'Volgens het proces-verbaal van het hoofdstembureau van Kortrijk houdende vaststelling van de zetelverdeling tussen de lijsten en van de rangorde van de raadsleden en hun opvolgers, d.d. 14 oktober 2012, zoals geldig verklaard bij besluit van de Raad voor Verkiezingsbetwistingen van 21 december 2012, is de heer Mattias Vandemaele de eerste opvolger.\nDe heer Mattias Vandemaele is bereid het mandaat van gemeenteraadslid op te nemen in opvolging van de heer Bart Caron.\n\nDe raad gaat over tot het onderzoek van de geloofsbrieven. Daartoe wordt de zitting geschorst van xx tot xx. De geloofsbrieven worden onderzocht door de twee jongste raadsleden S. Vanneste en A. Vandendriesche.\nDe raad gaat vervolgens over tot de stemming over het onderzoek van de geloofsbrieven, waarvan de uitslag luidt als volgt: xx\n\nVervolgens gaat de heer Mattias Vandemaele over tot de eedaflegging in handen van de voorzitter, waarvan de tekst conform artikel 7 §3 van het gemeentedecreet luidt als volgt: "Ik zweer de verplichtingen van mijn mandaat trouw na te komen". Van deze eedaflegging wordt een proces-verbaal opgemaakt.'
        }, {
          title: 'Juridische grond'
        }, {
          text: 'We verwijzen hierbij naar de bepalingen van het gemeentedecreet en het kiesdecreet.',
          refs: [{
            prop: 'lbld:legalBackground',
            value: {
              '@id': '_:kiesdecreet',
            }
          }, {
            prop: 'lbld:legalBackground',
            value: {
              '@id': '_:gemeentedecreet'
            }
          }]
        }, {
          title: 'Bevoegdheid'
        }, {
          text: 'De GR is bevoegd op basis van artikel 42-43 van het gemeentedecreet.',
          refs: [{
            prop: 'lbld:legalBackground',
            value: {
              '@id': '_:gemeentedecreet#42'
            }
          }, {
            prop: 'lbld:legalBackground',
            value: {
              '@id': '_:gemeentedecreet#43'
            }
          }]
        }, {
          title: 'Besluit',
          context: 'lbld:decision'
        }, {
          'type': 'lbld:Article',
          '@id': '_:decision-163#1',
          text: 'De geloofsbrieven van de heer Mattias Vandemaele goed te keuren.'
        }, {
          'type': 'lbld:Article',
          '@id': '_:decision-163#2',
          text: 'Akte te nemen van het proces-verbaal van eedaflegging van de heer Mattias Vandemaele.'
        }, {
          'type': 'lbld:Article',
          '@id': '_:decision-163#3',
          text: 'De heer Mattias Vandemaele te installeren als gemeenteraadslid.'
        }, {
          'type': 'lbld:Article',
          '@id': '_:decision-163#4',
          text: 'Huidige beslissing binnen de twintig dagen mee te delen aan de Vlaamse Regering.'
        }, {
          title: 'Bijlagen'
        }, {
          text: ''
        }]
      }]
    }
    for (var i = 0; i < data.fragments.length; i++) {
      if (!data.fragments[i].id) {
        data.fragments[i].id = data.fragments[i]['@id'] || ('_:' + i)
      }
      if (!data.fragments[i].text) {
        data.fragments[i].text = data.fragments[i]['schema:name']
      }
      if (!data.fragments[i].type) {
        data.fragments[i].type = data.fragments[i]['@type']
      }
    }
    return data
  }
}