<template>
  <div id="app" @click="blurred">
    <div class="header">
      <div class="page-container">
        <nav>
          <a href="#" :class="{active:mode==0}" @click.prevent="mode=0">Nieuw</a>
          <a href="#" :class="{active:mode==1}" @click.prevent="mode=1">Editor</a>
          <a href="#" :class="{active:mode==2}" @click.prevent="mode=2">Model</a>
          <a href="#" :class="{active:mode==3}" @click.prevent="mode=3">JSON-LD</a>
        </nav>
      </div>
    </div>
    <div class="page-container">
      <div class="page" v-if="mode<2">
        <header class="page-header">
          <label class="inp">
            <span class="inp-label">Orgaan</span>
            <select class="inp-text inp-select" v-model="env.orgaan" @change="defaultZitting">
              <option value="">Selecteren...</option>
              <optgroup :label="t.type" v-for="t in $root.orgaanOptions">
                <option v-for="org in t.options" :value="org.id" v-text="org.text"></option>
              </optgroup>
            </select>
          </label>
          <label class="inp" v-if="zittingOptions.length">
            <span class="inp-label">Zitting</span>
            <select class="inp-text inp-select" v-model="env.zitting">
              <option v-for="zit in zittingOptions" :value="zit.id" v-text="zit.text"></option>
            </select>
          </label>
          <label class="inp" v-if="zittingOptions.length&&env.zitting">
            <span class="inp-label">Sjabloon</span>
            <select class="inp-text inp-select" v-model="env.template" @change="start(env.template)">
              <option value="0">Standaard besluit</option>
              <option value="1">Wijziging mandaat gemeenteraadslid</option>
            </select>
          </label>
<!--           <label class="inp" v-if="zittingOptions.length&&env.zitting">
            <span class="inp-label">Onderwerp</span>
            <input class="inp-text" type="text" v-model="decision.subject">
          </label> -->
        </header>
        <h1 v-text="opschrift||decision.title||decision['dcterms:title']"></h1>
        <div class="mode-editor" v-if="mode==1">
          <div v-for="p in decision.p" track-by="$index" :is="component(p)" :article.sync="p"></div>
        </div>
        <div class="page-footer" v-if="mode==1">
          <button type="button" @click="publish">Publiceren</button>
          <a :href="url" v-text="url" target="_blank" style="margin-top: 10px;"></a>
          <span v-if="zittingOptions&&!env.advanced && env.zitting" @click="env.advanced=1" style="margin-top: 10px; opacity:.5">Meer opties...</span>
          <div v-else style="width:45%;margin-top:20px;">
            <label class="inp" v-if="env.advanced">
              <span class="inp-label">uuid:</span>
              <input class="inp-text" type="text" v-model="decision.uri">
            </label>
            <label class="inp" v-if="env.advanced">
              <span class="inp-label">URI:</span>
              <span style="white-space: nowrap">http://lblod.pieter.pm/decisions/{{encodeURIComponent(decision.uri)}}.html#decision</span>
            </label>
            <label class="inp" v-if="env.advanced">
              <span class="inp-label">BBC</span>
              <select class="inp-text inp-select" v-model="decision['lbld:bbcCode']" placeholder="todo:bbc suggestions">
                <option value="">Selecteren...</option>
                <option value="BV00">00 Algemene financiering</option>
                <option value="BV01">01 Algemeen bestuur</option>
                <option value="BV02">02 Zich verplaatsen en mobiliteit</option>
                <option value="BV03">03 Natuur en milieubeheer</option>
                <option value="BV04">04 Veiligheidszorg</option>
                <option value="BV05">05 Ondernemen en werken</option>
                <option value="BV06">06 Wonen en ruimtelijke ordening</option>
                <option value="BV07">07 Cultuur en vrije tijd</option>
                <option value="BV08">08 Leren en onderwijs</option>
                <option value="BV09">09 Zorg en opvang</option>
              </select>
            </label>
            <label class="inp" v-if="env.advanced">
              <span class="inp-label">Gebied</span>
              <input-spatial :model.sync="decision['dcterms:spatial']"></input-spatial>
            </label>
          </div>
        </div>
        <div class="mode-create" v-if="mode==0">
          <div v-if="wizard==0">
            <p>
              Welk besluit wenst u te nemen?
            </p>
            <button type="button" @click="start(1)">Wijziging mandaat gemeenteraadslid</button>
            <p v-if="env.zitting">
              <a href="#" @click.prevent="compile(0)">Doorgaan zonder sjabloon</a>
            </p>
            <p v-else>
              Kies een orgaan & zitting
            </p>
          </div>
          <div v-if="wizard==1">
            <label class="inp">
              <span class="inp-label">Ontslagnemend gemeenteraadslid</span>
              <input-mandaat :model.sync="data.pmandaat" :placeholder="data.pmandaat&&data.pmandaat.name||'Voornaam + familienaam'"></input-mandaat>
            </label>
            <div v-if="data.pmandaat">
              <label class="inp">
                <span class="inp-label">Einddatum van mandaat</span>
                <input class="inp-text inp-date" type="date" v-model="data.pdate">
              </label>
              <label class="inp">
                <span class="inp-label">Reden van vervanging</span>
                <input class="inp-text" type="text" v-model="data.preason">
              </label>
            </div>
            <br>
            <label class="inp">
              <span class="inp-label">Opvolgend gemeenteraadslid</span>
              <input-person :model.sync="data.kperson" :placeholder="data.kperson&&data.kperson.name||'Voornaam + familienaam'"></input-person>
            </label>
          </div>
          <div v-if="wizard==2">
            <label class="inp">
              <span class="inp-label">Ontslagnemer</span>
              <input class="inp-text" type="text" v-model="data.pname" @input="subj(data.pname)" placeholder="Voornaam + familienaam">
            </label>
            <label class="inp">
              <span class="inp-label">Opvolger</span>
              <input class="inp-text" type="text" v-model="data.oname" placeholder="Voornaam + familienaam">
            </label>
          </div>
          <div v-if="wizard>0">
            <br>
            <p v-if="env.zitting">
              <button v-if="data.pmandaat&&data.kperson" type="button" @click="compile()">Doorgaan</button>
              <span v-else>Kies een aftredend en opvolgend gemeenteraadslid</span>
            </p>
            <p v-else>
              Kies een orgaan & zitting
            </p>
          </div>
        </div>
      </div>
      <div class="page" v-if="mode==2">
        <pre v-text="decision|json"></pre>
      </div>
      <div class="page" v-if="mode==3">
        <pre v-text="jsonld|json"></pre>
      </div>
    </div>
    <div id="jsonld" style="display:none" v-if="render">
      <h1 v-text="jsonld['dcterms:title']"></h1>
      <section v-for="p in decision.p" track-by="$index">
        <h2 v-if="p.title&&!p.subtitle" class="section-title">{{p.title}}</h2>
        <h3 v-if="p.title&&p.subtitle" class="section-title">{{p.title}}</h3>
        <div v-if="!p.title" v-text="p.text"></div>
      </section>
      <script type="application/json" v-html="decision|json"></script>
    </div>
  </div>
</template>

<script>
// notule > besluiten > artikels
import '../assets/scss/main.scss'
import InputMandaat from './components/InputMandaat.vue'
import InputPerson from './components/InputPerson.vue'
import InputSpatial from './components/InputSpatial.vue'
import LbArticle from './components/LbArticle.vue'
import LbLegal from './components/LbLegal.vue'
import LbParagraph from './components/LbParagraph.vue'
import LbSubtitle from './components/LbSubtitle.vue'
import LbTitle from './components/LbTitle.vue'
import TextareaGrowing from './components/TextareaGrowing.vue'

const EMPTY_ARTICLE = {
  '@id': null,
  'text': null,
  'refs': null
}
const CURRENT_USER = {
  '@id': null,
  '@type': 'schema:Person',
  'schema:name': 'Alfred Van Den Beele'
}
const BACKEND_URL = 'http://lblod.pieter.pm/'
function bboxToWKT (bbox) {
  if (!bbox) {
    return null
  }
  var [a, b, c, d] = bbox.split(',')
  return {
    '@type': 'http://www.opengis.net/ont/geosparql#wktLiteral',
    '@value': '<http://www.opengis.net/def/crs/OGC/1.3/CRS84> POLYGON(' + a + ',' + b + ',' + a + ',' + d + ',' + c + ',' + d + ',' + c + ',' + b + ',' + a + ',' + b + ')'
  }
}
function isDoc (obj) {
  return obj.type == 'lbld:Decision' || obj.type == '_:MandaatVoordracht'
}
function inert (obj) {
  return obj && JSON.parse(JSON.stringify(obj)) || obj
}
function addRefs (obj) {
  if (!obj) {
    return emptyDecision
  }
  obj = inert(obj)
  console.log(obj)
  var context
  var counter = 1
  for (var i = 0; i < obj.p.length; i++) {
    if (!obj.p[i].refs) {
      obj.p[i].refs = []
    }
    if (obj.p[i].title) {
      context = obj.p[i].context
      counter = 1
    } else if (context) {
      obj.p[i].counter = counter
      obj.p[i]['@id'] = 'current:' + context.slice(5) + '-' + counter
      counter++
    }
  }
  return obj
}

var sampleDecision
try {
  sampleDecision = JSON.parse(window.localStorage.getItem('decision'))
} catch (e) {}
sampleDecision = sampleDecision
var emptyDecision = {
  '@type': 'lbld:Decision',
  '@id': null,
  'lbld:type': 'Gemeenteraad',
  'dcterms:title': null,
  'dcterms:abstract': null,
  'dcterms:spatial': null,
  'dcterms:temporal': null,
  'dcterms:topic': null,
  'dcterms:type': null,
  'lbld:legalBackground': null,
  'lbld:responsibleFor': null,
  'lbld:bbcCode': '',
  'lbld:changes': null,
  'lbld:replaces': null,
  'lbld:responsibleFor': null,
  'lbld:zitting': null,
  'schema:author': {
    '@type': 'schema:Person',
    'schema:name': 'Bob'
  },
  'dcterms:description': null,
  uri: null,
  subject: null,
  p: []
}
// Templates paragraphs
var templates = [
  function () {
    return [{
      title: 'Juridische gronden',
      context: 'lbld:legalBackground'
    }, {
      text: ''
    }, {
      title: 'Motivering, feiten en context',
      context: 'lbld:motivation'
    }, {
      '@id': '',
      text: ''
    }, {
      title: 'Besluit',
      context: 'lbld:article'
    }, {
      '@id': '',
      'type': 'lbld:Article',
      text: ''
    }, {
      title: 'Bijlagen'
    }, {
      text: ''
    }]
  },
  function (data) {
    if (data.pmandaat) {
      data.pname = data.pmandaat.name
    }
    if (data.kperson) {
      data.kname = data.kperson.name
      data.o1name = data.kperson.name
    }
    var p = [{
      title: 'Juridische gronden',
      context: 'lbld:legalBackground'
    }, {
      title: 'Bevoegdheid',
      context: 'lbld:legalBackground',
      subtitle: true
    }, {
      text: 'Gelet op Artikel 7, §3 van het Gemeentedecreet van 15 juli 2005'
    }, {
      title: 'Hogere rechtsnormen',
      context: 'lbld:legalBackground',
      subtitle: true
    }, {
      text: 'Gelet op Artikel 11 van het Gemeentedecreet van 15 juli 2005'
    }, {
      text: 'Gelet op Artikel 12 van het Gemeentedecreet van 15 juli 2005'
    }, {
      text: 'Gelet op Artikel 15 van het Gemeentedecreet van 15 juli 2005'
    }, {
      text: 'Gelet op Artikel 16 van het Gemeentedecreet van 15 juli 2005'
    }, {
      text: 'Gelet op Artikel 8-14 van het Lokaal en Provinciaal Kiesdecreet van 8 juli 2011\nOm gemeenteraadskiezer te zijn, moet men de leeftijd van achttien jaar hebben bereikt, in de bevolkingsregisters van de gemeente ingeschreven zijn en zich niet bevinden in één van de gevallen van uitsluiting of schorsing.'
    }, {
      text: 'Gelet op Artikel 58 van het Lokaal en Provinciaal Kiesdecreet van 8 juli 2011\nOm tot gemeenteraadslid verkozen te kunnen worden en blijven, moet men kiezer zijn en moet men de kiesvoorwaarden behouden en mag men zich niet in een geval van schorsing of uitsluiting bevinden. Dit artikel omschrijft verder ook de situaties waarin personen niet verkiesbaar zijn als gemeenteraadslid.'
    }, {
      text: 'Gelet op Artikel 169, §2, 5° van het Lokaal en Provinciaal Kiesdecreet van 8 juli 2011\nDe niet-verkozen kandidaten worden eerste, tweede, derde enzovoort opvolger verklaard in afnemende grootte van het aantal stemmen dat zij hebben bekomen, na een nieuwe overdracht van de lijststemmen, te beginnen bij de eerste niet-effectief verkozen kandidaat.'
    }, {
      text: 'Gelet op Omzendbrief BB-2012/2 van 19 oktober 2012 – Start van de lokale en provinciale bestuursperiode\nDeze omzendbrief geeft o.a. toelichting bij het onderzoek van de geloofsbrieven.'
    }, {
      title: 'Motivering, feiten en context'
    }, {
      text: '',
      placeholder: 'Geef aan wanneer de relevante gemeenteraadsverkiezingen werden goedgekeurd'
    }, {
      text: '',
      placeholder: 'Geef aan wanneer de betrokkene de eedaflegging heeft afgelegd'
    }, {
      text: '',
      placeholder: 'Geef aan hoe en wanneer de betrokkene schriftelijk ontslag heeft meegedeeld aan de voorzitter'
    }, {
      text: 'De voorzitter nam kennis van het ontslag van gemeenteraadslid {{pname}} op {{pdate}}. Door deze kennisname is het ontslag definitief. De raad kan hier enkel akte van nemen.'
    }, {
      text: 'Uit het proces-verbaal van het gemeentelijk hoofdbureau blijkt dat {{o1name}} eerste opvolger voor de lijst "{{o1lijst}}" is.'
    }, {
      text: 'De geloofsbrieven van {{o1name}} werden behoorlijk en tijdig ingediend en werden ter inzage gelegd met respect voor de decretale bepalingen.'
    }, {
      text: 'Uit het onderzoek van de geloofsbrieven van de verkozen gemeenteraadsleden door de gemeenteraad, zoals voorgeschreven in artikel 7, §2 en artikel 10 van het Gemeentedecreet, blijkt dat {{o1name}} voldoet aan de verkiesbaarheidsvoorwaarden.'
    }, {
      text: 'Mathias Van Compernolle heeft verklaard zich niet in een situatie van onverenigbaarheid te bevinden.'
    }, {
      title: 'Besluit',
      context: 'lbld:article'
    }, {
      'type': 'lbld:Article',
      text: 'De raad neemt kennis van het ontslag van raadslid {{pname}}.'
    }, {
      'type': 'lbld:Article',
      text: 'De raad keurt de geloofsbrieven van {{o1name}} goed.'
    }, {
      'type': 'lbld:Article',
      text: 'De raad neemt kennis van de eedaflegging van {{o1name}} in handen van de voorzitter van de gemeenteraad.'
    }, {
      title: 'Bijlagen'
    }, {
      text: ''
    }]
    return p
  }
]

// Template data
var data = [
  // Default template has no data
  {},
  // Mandaat template
  {
    p: false,
    pname: '',
    pdate: new Date().toJSON().slice(0, 10),
    preason: 'ontslag',
    kname: '',
    kdate: '',
    o1: false,
    o1name: '',
    o1date: '',
    o1lijst: 'Vlavirgem feest',
    o2: false,
    o2name: '',
    o2date: '',
  },
  // Ontslag
  {
    title: 'Ontslag gemeenteraadslid',
    pname: '',
    oname: ''
  }
]
var opschrift = [
  null,
  function (data) {
    if (!data) return;
    var subj = []
    if (data.pmandaat) {
      subj.push('de kennisname van het ontslag van raadslid ' + data.pmandaat.name)
    }
    if (data.kperson) {
      subj.push('de installatie van opvolger ' + data.kperson.name)
    }
    return subj ? 'betreffende ' + subj.join(' en ') : ''
  }
]

export default {
  data () {
    return {
      decision: addRefs(emptyDecision),
      env: {
        advanced: false,
        person: CURRENT_USER,
        orgaan: 'http://vlavirgem.pieter.pm/#gemeenteraad',
        zitting: '_:zitting-1',
        template: 0
      },
      mode: 0,
      render: false,
      url: null,
      wizard: 0,
      data: null
    }
  },
  computed: {
    decisionOrgaan () {
      if (!this.zittingOptions || !this.decision || !this.decision['lbld:zitting']) {
        return
      }
      return this.zittingOptions.find(z => z.id === this.decision['lbld:zitting']['@id'])
    },
    zittingOptions () {
      if (!this.$root.fragments || !this.env.orgaan) {
        return []
      }
      return this.$root.fragments.filter(t => t['lbld:organization'] && t['lbld:organization']['@id'] === this.env.orgaan)
    },
    zittingDate () {
      var zit = this.zittingOptions.find(z => z.id === this.env.zitting)
      return zit && zit.date
    },
    docs () {
      if (!this.$root.fragments) {
        return []
      }
      return this.$root.fragments.filter(isDoc)
    },
    opschrift () {
      if (!this.decision) {
        return ''
      }
      var d = inert(data[this.env.template])
      if (opschrift[this.env.template]) {
        return 'Gemeenteraadsbesluit van ' + (this.zittingDate || 'datum') + ' ' + opschrift[this.env.template](this.data)
      }
      return ['Gemeenteraadsbesluit van ' + (this.zittingDate || 'datum'), d && d.title, this.decision.subject].filter(Boolean).join(' - ')
    },
    jsonld () {
      var decision = inert(this.decision);
      var context

      // Loop over paragraphs and pick up refs based on context
      for (var i = 0; i < decision.p.length; i++) {
        let p = decision.p[i]

        // Title sets the context of the underlying paragraphs
        if (p.title) {
          context = p.context
        } else if (context) {
          if (!decision[context]) {
            decision[context] = []
          }
          for (var j = 0; j < p.refs.length; j++) {
            if (!p[p.refs[j].prop]) {
              p[p.refs[j].prop] = []
            }
            p[p.refs[j].prop].push(p.refs[j].value)
          }
          if (context === 'lbld:article') {
            p['@type'] = 'lbld:Article'
            p['dcterms:title'] = 'Artikel ' + p.counter + ' van het Gemeenteraadsbesluit van ' + (this.zittingDate || 'datum')
            p['dcterms:description'] = p.text
          } else if (context === 'lbld:legalBackground' && p['@id'].startsWith('current')) {
            p['@type'] = 'lbld:Article'
            p['dcterms:title'] = p.text.slice(0, p.text.indexOf('\n'))
            if (p.text.indexOf('\n') !== -1) {
              p['dcterms:description'] = p.text.slice(p.text.indexOf('\n') + 1)
            }
          }
          delete p.type
          delete p.counter
          delete p.refs
          delete p.text
          decision[context].push(p)
        } else if (p.refs) {
          for (var j = 0; j < p.refs.length; j++) {
            if (!decision[p.refs[j].prop]) {
              decision[p.refs[j].prop] = []
            }
            decision[p.refs[j].prop].push(p.refs[j].value)
          }
        }
      }
      decision['dcterms:spatial'] = bboxToWKT(this.decision['dcterms:spatial'])
      delete decision.p
      for (let key in decision) {
        if (!decision[key]) {
          delete decision[key]
        }
      }
      decision['dcterms:title'] = this.opschrift
      decision['@context'] = {
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "schema": "http://schema.org/",
        "dcterms": "http://purl.org/dc/terms/",
        "mandaat": 'http://mandates.data.vlaanderen.be/ns#',
        "lbld": 'http://decisions.data.vlaanderen.be/ns#'
      }
      delete decision.subject
      if (decision.uri) {
        decision['@id'] = BACKEND_URL + 'decisions/' + decision.uri + '.html#decision'
        decision['@context'].current = BACKEND_URL + 'decisions/' + decision.uri + '.html#'
        delete decision.uri
      }
      // TODO: split off to seperate function
      if (this.env.template == 1) {
        decision['lbld:bbcCode'] = 'BV01'
        if (this.data.pmandaat) {
          if (!decision['lbld:changes']) {
            decision['lbld:changes'] = []
          }
          let man = inert(this.data.pmandaat)
          man['schema:endDate'] =  {
            '@type': 'xsd:date',
            '@value': this.data.pdate
          }
          decision['lbld:changes'].push(man)
        }
        if (this.data.kperson) {
          if (!decision['lbld:creates']) {
            decision['lbld:creates'] = []
          }
          decision['lbld:creates'].push({
            '@type': 'mandaat:Mandate',
            'mandaat:mandateType': 'gemeenteraadslid',
            'mandaat:person': this.data.kperson,
            'schema:startDate': {
              '@type': 'xsd:date',
              '@value': this.zittingDate
            }
          })
        }
      }
      decision['schema:event'] = this.zittingOptions.find(z => z.id === this.env.zitting)
      return decision
    }
  },
  methods: {
    blurred () {
      this.$broadcast('blurred')
    },
    defaultZitting () {
      this.env.zitting = this.zittingOptions.length ? this.zittingOptions[0].id : null
    },
    component (p) {
      if (p.subtitle) {
        return 'LbSubtitle'
      }
      if (p.title) {
        return 'LbTitle'
      }
      if (p.text && p.text.startsWith('Gelet op')) {
        return 'LbLegal'
      }
      if (p.type == 'lbld:Article') {
        return 'LbArticle'
      }
      if (p.context == 'lbld:legalBackground') {
        // return 'Lblegal'
      }
      return 'LbParagraph'
    },
    edit (doc) {
      for (let key in doc) {
        this.decision[key] = doc[key]
      }
      this.mode = 1
    },
    start (tpl) {
      this.env.template = tpl
      this.data = inert(data[tpl])
      this.decision['dcterms:title'] = this.data && this.data.title
      console.log(inert(data[tpl]))
      if (!data[tpl]) {
        this.compile(tpl)
      } else {
        this.wizard = tpl
        this.env.template = tpl
        this.mode = 0
      }
    },
    compile () {
      var decision = inert(emptyDecision)
      decision.p = inert(templates[this.wizard](this.data))
      for (let key in this.data) {
        for (var i = 0; i < decision.p.length; i++) {
          if ( decision.p[i].text)
          decision.p[i].text = decision.p[i].text.replace('{{' + key + '}}', this.data[key])
        }
      }
      decision['dcterms:title'] = this.data && this.data.title
      if (!decision.uri) {
        decision.uri = (new Date()).toISOString();
        this.url = null
      }
      this.decision = addRefs(decision)
      this.mode = 1
    },
    subj (s) {
      this.decision.subject = s
    },
    publish () {
      this.render = true
      this.$nextTick(function () {
        var html = '<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8">'
        html += '<title>' + this.opschrift + ' - LBLOD</title>'
        html += '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">'
        html += '<style type="text/css">section>div{white-space:pre-wrap;margin-bottom:.5rem}</style>'
        html += '</head><body>'
        html += '<div class="jumbotron"><div class="container"><h1>Lokaal besluit</h1><p>Deze webstek maakt deel uit van het project LBLOD.</p><p><a class="btn btn-primary btn-lg" href="http://lokaalbestuur.vlaanderen.be/lokale-besluiten-als-gelinkte-open-data" role="button">Meer info &raquo;</a></p></div></div>'
        html += '<div class="container">'
        html += this.$el.querySelector('#jsonld').innerHTML
        html += '</div>'
        html += '<script type="application\/ld+json">' + JSON.stringify(this.jsonld) + '<\/script></body></html>'
        console.log(html)
        this.$http.post(BACKEND_URL + 'admin/index.php', {
          uri: this.decision.uri,
          html: html
        }).then(function () {
          this.url = this.jsonld['@id']
        })
        this.render = false
      })
    }
  },
  events: {
    set (prop, value) {
      console.log('set cate', prop, value)
      this.decision[prop] = value
    },
    append (article) {
      let obj = this.decision
      for (var s = 0; s < obj.p.length; s++) {
          if (obj.p[s] === article) {
            var a = inert(EMPTY_ARTICLE)
            a.type = article.type
            a.context = article.context
            obj.p.splice(s + 1, 0, a)
            break
          }
      }
      // Article numbering
      var counter = 0
      for (var i = 0; i < obj.p.length; i++) {
        if (obj.p[i].title && obj.p[i].context === 'lbld:article') {
          counter = 1
        } else if (counter) {
          obj.p[i].counter = counter
          obj.p[i]['@id'] = 'current:article-' + counter
          counter++
        }
      }
    },
    rm (article) {
      for (var s = 0; s < this.decision.p.length; s++) {
        if (this.decision.p[s] === article) {
          if ((!this.decision.p[s + 1] || !this.decision.p[s + 1].text) && !this.decision.p[s-1].text) {
            this.decision.p.splice(s, 1, inert(EMPTY_ARTICLE))
          } else {
            this.decision.p.splice(s, 1)
          }
          return
        }
      }
     }
    },
  watch: {
    'decision.uri' : function (uri) {
      this.decision.uri = uri.replace(/[^a-zA-Z0-9\-_]+/, '')
    }
  },
  components: {
    InputMandaat,
    InputPerson,
    InputSpatial,
    LbArticle,
    LbLegal,
    LbParagraph,
    LbSubtitle,
    LbTitle,
    TextareaGrowing
  }
}
</script>
