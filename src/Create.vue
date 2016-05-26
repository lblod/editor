<template>
  <div id="app" @click="blurred">
    <div class="header">
      <div class="page-container">
        <nav>
          <a href="#" :class="{active:!json&&wizard>=0}" @click.prevent="create">Nieuw</a>
          <a href="#" :class="{active:!json&&wizard<0}" @click.prevent="json=0">Editor</a>
          <a href="#" :class="{active:json==1}" @click.prevent="json=1">Model</a>
          <a href="#" :class="{active:json==2}" @click.prevent="json=2">JSON-LD</a>
        </nav>
      </div>
    </div>
    <div class="page-container">
      <div class="page" v-if="!json">
        <header class="page-header">
          <label class="inp">
            <span class="inp-label">Orgaan</span>
            <select class="inp-text inp-select" v-model="env.orgaan" @change="env.zitting=null">
              <option value="">Selecteren...</option>
              <optgroup :label="t.type" v-for="t in $root.orgaanOptions">
                <option v-for="org in t.options" :value="org.id" v-text="org.text"></option>
              </optgroup>
            </select>
          </label>
          <label class="inp" v-if="zittingOptions">
            <span class="inp-label">Zitting</span>
            <select class="inp-text inp-select" v-model="env.zitting">
              <option v-for="zit in zittingOptions" :value="zit.id" v-text="zit.text"></option>
            </select>
          </label>
          <label class="inp" v-if="zittingOptions&&env.zitting">
            <span class="inp-label">Sjabloon</span>
            <select class="inp-text inp-select" v-model="env.template" @change="start(env.template)">
              <option value="0">Standaard besluit</option>
              <option disabled>Voordracht kandidaat-burgemeester</option>
              <option disabled>Voordracht kandidaat-voorzitter gemeenteraad</option>
              <option value="1">Voordracht kandidaat-schepenen</option>
              <option disabled>Voordracht OCMW-raadsleden</option>
              <option disabled>Voordracht politieraadsleden</option>
              <option value="2">Ontslag gemeenteraadslid - Aktename</option>
            </select>
          </label>
          <label class="inp" v-if="zittingOptions&&env.zitting">
            <span class="inp-label">Onderwerp</span>
            <input class="inp-text" type="text" v-model="decision.subject">
          </label>
          <span v-if="zittingOptions&&!env.advanced && env.zitting" @click="env.advanced=1" style="margin-top: 10px; opacity:.5">Meer opties...</span>
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
          <label class="inp" v-if="env.advanced">
            <span class="inp-label">URI</span>
            <input class="inp-text" type="text" v-model="decision.uri">
          </label>
        </header>
        <h1 v-text="opschrift||decision.title||decision['dcterms:title']"></h1>
        <div class="mode-editor" v-if="wizard<0">
          <section class="section" v-for="p in decision.p" track-by="$index">
            <h2 v-if="p.title" class="section-title">{{p.title}}</h2>
            <lb-article v-if="p.type=='lbld:Article'" :article.sync="p"></lb-article>
            <lb-paragraph v-if="p.type!=='lbld:Article'&&!p.title" :article.sync="p"></lb-paragraph>
          </section>
        </div>
        <div v-if="wizard<0">
          <div class="page-footer">
            <button type="button" @click="publish">Publiceren</button>
            <a :href="url" v-text="url" target="_blank"></a>
          </div>
        </div>
        <div v-if="wizard==0">
          <p>
            Kies een sjabloon om snel een besluit op te maken.
          </p>
          <ul>
            <li><a href="#" @click.prevent="start(1)">Voordracht kandidaat schepen</a></li>
            <li><a href="#" @click.prevent="start(2)">Aktename ontslag</a></li>
          </ul>
          <p v-if="env.zitting">
            <button type="button" @click="compile(0)">Doorgaan zonder sjabloon</button>
          </p>
          <p v-else>
            Kies een orgaan & zitting
          </p>
        </div>
        <div v-if="wizard==1">
          <label class="inp">
            <span class="inp-label">Kandidaat-schepen</span>
            <input class="inp-text" type="text" v-model="data.kname" @input="subj(data.kname)" placeholder="Voornaam + familienaam">
          </label>
          <label class="inp">
            <span class="inp-label">Einddatum van mandaat</span>
            <input class="inp-text inp-date" type="date" v-model="data.kdate">
          </label>
          <br>
          <div v-if="data.p">
            <label class="inp">
              <span class="inp-label">Te vervangen schepen</span>
              <input class="inp-text" type="text" v-model="data.prev" placeholder="Voornaam + familienaam">
            </label>
            <label class="inp">
              <span class="inp-label">Einddatum van mandaat</span>
              <input class="inp-text inp-date" type="date" v-model="data.end">
            </label>
            <label class="inp">
              <span class="inp-label">Reden van vervanging</span>
              <input class="inp-text" type="text" v-model="data.reason">
            </label>
          </div>
          <div v-else>
            <a href="#" @click.prevent="data.p=true">Te vervangen schepen</a>
          </div>
          <br>
          <div v-if="data.o1">
            <label class="inp">
              <span class="inp-label">Opvolger</span>
              <input class="inp-text" type="text" v-model="data.o1name" placeholder="Voornaam + familienaam">
            </label>
            <label class="inp">
              <span class="inp-label">Einddatum van mandaat</span>
              <input class="inp-text inp-date" type="date" v-model="data.o1date">
            </label>
          </div>
          <div v-else>
            <a href="#" @click.prevent="data.o1=true">Opvolger</a>
          </div>
          <br>
          <div v-if="data.o2">
            <label class="inp">
              <span class="inp-label">Tweede opvolger</span>
              <input class="inp-text" type="text" v-model="data.o2name" placeholder="Voornaam + familienaam">
            </label>
            <label class="inp">
              <span class="inp-label">Einddatum van mandaat</span>
              <input class="inp-text inp-date" type="date" v-model="data.o2date">
            </label>
          </div>
          <div v-if="data.o1&&!data.o2">
            <a href="#" @click.prevent="data.o2=true">Tweede opvolger</a>
          </div>
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
          <p v-if="env.zitting">
            <button type="button" @click="compile()">Doorgaan</button>
          </p>
          <p v-else>
            Kies een orgaan & zitting
          </p>
        </div>
      </div>
      <div class="page" v-if="json==1">
        <pre v-text="decision|json"></pre>
      </div>
      <div class="page" v-if="json==2">
        <pre v-text="jsonld|json"></pre>
      </div>
    </div>
    <div id="jsonld" style="display:none" v-if="render">
      <section class="section" v-for="p in decision.p" track-by="$index">
        <h2 v-if="p.title" class="section-title">{{p.title}}</h2>
        <div v-else v-text="p.text"></div>
      </section>
    </div>
  </div>
</template>

<script>
// notule > besluiten > artikels
import '../assets/scss/main.scss'
import InputSpatial from './components/InputSpatial.vue'
import LbArticle from './components/LbArticle.vue'
import LbParagraph from './components/LbParagraph.vue'
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
    'schema:name': ''
  },
  'dcterms:description': null,
  uri: null,
  subject: null,
  p: []
}
// Templates paragraphs
var templates = [
  [{
    title: 'Aanleiding'
  }, {
    text: ''
  }, {
    title: 'Motivatie',
    context: 'lbld:motivation'
  }, {
    '@id': '',
    text: ''
  }, {
    title: 'Juridische grond'
  }, {
    text: '',
  }, {
    title: 'Besluit',
    context: 'lbld:decision'
  }, {
    '@id': '',
    'type': 'lbld:Article',
    text: ''
  }, {
    title: 'Bijlagen'
  }, {
    text: ''
  }],
  [{
    title: 'Dit is geen beluit?'
  }, {
    text: ''
  }],
  [{
    title: 'Aanleiding'
  }, {
    text: '{{pname}} liet weten dat hij ontslag neemt als gemeenteraadslid.'
  }, {
    title: 'Motivatie',
    context: 'lbld:Motivation'
  }, {
    '@id': '',
    text: 'Volgens het proces-verbaal van het hoofdstembureau van Kortrijk houdende vaststelling van de zetelverdeling tussen de lijsten en van de rangorde van de raadsleden en hun opvolgers, d.d. 14 oktober 2012, zoals geldig verklaard bij besluit van de Raad voor Verkiezingsbetwistingen van 21 december 2012, is {{oname}} de eerste opvolger.'
  }, {
    '@id': '',
    text: '',
  }, {
    '@id': '',
    text: '{{oname}} gaat over tot de eedaflegging in handen van de voorzitter, waarvan de tekst conform artikel 7 §3 van het gemeentedecreet luidt als volgt: "Ik zweer de verplichtingen van mijn mandaat trouw na te komen". Van deze eedaflegging wordt een proces-verbaal opgemaakt.',
    refs: [{
      prop: 'lbld:legalBackground',
      value: {
        '@id': '_:gemeentedecreet#7.3',
      }
    }]
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
    '@id': '',
    text: 'De geloofsbrieven van {{oname}} goed te keuren.'
  }, {
    'type': 'lbld:Article',
    '@id': '',
    text: 'Akte te nemen van het proces-verbaal van eedaflegging van {{oname}}.'
  }, {
    'type': 'lbld:Article',
    '@id': '',
    text: '{{oname}} te installeren als gemeenteraadslid.'
  }, {
    'type': 'lbld:Article',
    '@id': '',
    text: 'Huidige beslissing binnen de twintig dagen mee te delen aan de Vlaamse Regering.'
  }, {
    title: 'Bijlagen'
  }, {
    text: ''
  }]
]
// Template data
var data = [
  // Default template has no data
  {},
  // Mandaat template
  {
    title: 'Voordracht mandaat',
    p: false,
    pname: '',
    pdate: '',
    preason: '',
    kname: '',
    kdate: '',
    o1: false,
    o1name: '',
    o1date: '',
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

export default {
  data () {
    // Default view
    var wizard = 0
    var initialDecision = wizard >= 0 ? emptyDecision : sampleDecision

    return {
      decision: addRefs(initialDecision),
      env: {
        advanced: false,
        person: CURRENT_USER,
        orgaan: '',
        zitting: '_:zitting-1',
        template: 0
      },
      json: 0,
      render: false,
      url: null,
      template: 0,
      wizard: wizard,
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
      return this.$root.fragments.filter(t => t['lbld:orgaan'] && t['lbld:orgaan']['@id'] === this.env.orgaan)
    },
    opschrift: {
      get () {
        if (!this.decision || !this.env.zitting || !this.env.template) {
          return ''
        }
        var d = inert(data[this.env.template])
        var zit = this.zittingOptions.find(z => z.id === this.env.zitting)
        var org = this.$root.fragments.find(o => zit['lbld:orgaan'] && (zit['lbld:orgaan']['@id'] === o.id))
        return [org.text, zit.date, d.title, this.decision.subject].filter(Boolean).join(' - ')
      },
      set (text) {
        this.decision['dcterms:title'] = text
      }
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
      delete decision.p
      for (let key in decision) {
        if (!decision[key]) {
          delete decision[key]
        }
      }
      decision['dcterms:title'] = this.opschrift
      decision['@context'] = {
        "schema": "http://schema.org/",
        "dcterms": "http://purl.org/dc/terms/",
        lbld: 'http://lbld.vlaanderen/'
      }
      delete decision.subject
      if (decision.uri) {
        decision['@id'] = BACKEND_URL + 'decisions/' + decision.uri + '.html#decision'
        decision['@context'].current = BACKEND_URL + 'decisions/' + decision.uri + '.html#'
        delete decision.uri
      }
      return decision
    }
  },
  methods: {
    blurred () {
      this.$broadcast('blurred')
    },
    create () {
      this.json = 0
      this.wizard = 0
      this.decision = addRefs(emptyDecision)
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
        this.template = tpl
      }
    },
    compile () {
      var decision = inert(emptyDecision)
      decision.p = inert(templates[this.wizard])
      for (let key in this.data) {
        for (var i = 0; i < decision.p.length; i++) {
          if ( decision.p[i].text)
          decision.p[i].text = decision.p[i].text.replace('{{' + key + '}}', this.data[key])
        }
      }
      decision['dcterms:title'] = this.data && this.data.title
      if (!decision.uri) {
        decision.uri = Date.now() % 100
        this.url = null
      }
      this.decision = addRefs(decision)
      // TODO: replace template data based on this.data[this.wizard]
      this.json = 0
      this.wizard = -1
    },
    subj (s) {
      this.decision.subject = s
    },
    publish () {
      this.render = true
      this.$nextTick(function () {
        var html = this.$el.querySelector('#jsonld').innerHTML
        html += '<script type="application\/ld+json">' + JSON.stringify(this.jsonld) + '<\/script>'
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
      for (var s = 0; s < this.decision.p.length; s++) {
          if (this.decision.p[s] === article) {
            var a = inert(EMPTY_ARTICLE)
            a.type = article.type
            this.decision.p.splice(s + 1, 0, a)
            return
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
  components: {
    InputSpatial,
    LbArticle,
    LbParagraph,
    TextareaGrowing
  }
}
</script>
