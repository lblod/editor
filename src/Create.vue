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
            <span class="inp-label">Type</span>
            <select class="inp-text inp-select" v-model="decision['lbld:type']">
              <option>Gemeenteraad</option>
            </select>
          </label>
          <label class="inp">
            <span class="inp-label">Aard</span>
            <select class="inp-text inp-select" v-model="decision['lbld:aard']">
              <option>Mandaat</option>
            </select>
          </label>
          <label class="inp">
            <span class="inp-label">Sjabloon</span>
            <select class="inp-text inp-select" v-model="template" @change="start(template)">
              <option value="0">Standaard besluit</option>
              <option value="1">Voordracht kandidaat-schepen</option>
              <option value="2">Aktename ontslag</option>
            </select>
          </label>
          <label class="inp">
            <span class="inp-label">Auteur</span>
            <input class="inp-text" type="text" v-model="decision['schema:author']['schema:name']">
          </label>
          <label class="inp">
            <span class="inp-label">BBC</span>
            <input class="inp-text" type="text" v-model="decision['lbld:bbcCode']" placeholder="todo:bbc suggestions">
          </label>
          <label class="inp">
            <span class="inp-label">URI</span>
            <input class="inp-text" type="text" v-model="decision['@id']">
          </label>
        </header>
        <div class="mode-editor" v-if="wizard<0">
          <textarea-growing style="font-size:1.5rem;margin-top:2rem;" :model.sync="decision['dcterms:title']" placeholder="Titel van het besluit"></textarea-growing>
          <section class="section" v-for="p in decision.p" track-by="$index">
            <h2 v-if="p.title" class="section-title">{{p.title}}</h2>
            <lb-article v-if="p.type=='lbld:Article'" :article.sync="p"></lb-article>
            <lb-paragraph v-if="p.type!=='lbld:Article'&&!p.title" :article.sync="p"></lb-paragraph>
          </section>
          <div class="page-footer" style="display:none">
            <button type="button" @click="save">Bewaren</button>
            <button type="button" @click="reset">Reset</button>
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
          <button type="button" @click="compile(0)">Doorgaan zonder sjabloon</button>
        </div>
        <div v-if="wizard==1">
          <label class="inp">
            <span class="inp-label">Kandidaat-schepen</span>
            <input class="inp-text" type="text" v-model="data.kname" placeholder="Voornaam + familienaam">
          </label>
          <label class="inp">
            <span class="inp-label">Einddatum van mandaag</span>
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
          <p>
            <button type="button" @click="compile()">Doorgaan</button>
          </p>
        </div>
        <div v-if="wizard==2">
        Coming soon
        </div>
      </div>
      <div class="page" v-if="json==1">
        <pre v-text="decision|json"></pre>
      </div>
      <div class="page" v-if="json==2">
        <pre v-text="jsonld|json"></pre>
      </div>
    </div>
  </div>
</template>

<script>
// notule > besluiten > artikels
import '../assets/scss/main.scss'
import LbArticle from './components/LbArticle.vue'
import LbParagraph from './components/LbParagraph.vue'
import TextareaGrowing from './components/TextareaGrowing.vue'

const EMPTY_ARTICLE = {
  '@id': null,
  'dcterms:description': null
}
function inert (obj) {
  return obj && JSON.parse(JSON.stringify(obj)) || obj
}
function addRefs (obj) {
  obj = inert(obj)
  for (var i = 0; i < obj.p.length; i++) {
    if (!obj.p[i].refs) {
      obj.p[i].refs = []
    }
  }
  return obj
}

var sampleDecision 
try {
  sampleDecision = JSON.parse(window.localStorage.getItem('decision'))
} catch (e) {}
sampleDecision = sampleDecision || {
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
}
var emptyDecision = {
  '@type': 'lbld:Decision',
  '@id': null,
  'lbld:type': 'Gemeenteraad',
  'lbld:aard': 'Mandaat',
  'dcterms:title': null,
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
  'schema:author': {
    '@type': 'schema:Person',
    'schema:name': ''
  },
  'dcterms:description': null,
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
    context: 'lbld:Motivation'
  }, {
    '@id': '',
    text: ''
  }, {
    title: 'Juridische grond'
  }, {
    text: '',
  }, {
    title: 'Bevoegdheid'
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
    title: 'Aanleiding'
  }, {
    text: ''
  }, {
    title: 'Motivatie',
    context: 'lbld:Motivation'
  }, {
    '@id': '',
    text: ''
  }, {
    title: 'Juridische grond'
  }, {
    text: '',
  }, {
    title: 'Bevoegdheid'
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
  }]
]
// Template data
var data = [
  // Default template has no data
  {},
  // Mandaat template
  {
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
  true
]

export default {
  data () {
    // Default view
    var wizard = 0
    var initialDecision = wizard >= 0 ? emptyDecision : sampleDecision

    return {
      decision: addRefs(initialDecision),
      json: 0,
      template: 0,
      wizard: wizard,
      data: null
    }
  },
  computed: {
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
      this.data = inert(data[tpl])
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
      this.decision = addRefs(decision)
      // TODO: replace template data based on this.data[this.wizard]
      this.json = 0
      this.wizard = -1
    },
    reset () {
      window.localStorage.removeItem('decision')
      console.log('reset localStorage')
      window.location.reload()
    },
    save () {
      window.localStorage.setItem('decision', JSON.stringify(this.decision))
      console.log('saved in localStorage')
    }
  },
  events: {
    set (prop, value) {
      console.log('set cate', prop, value)
      this.filterState[prop] = value
    },
    append (article) {
      for (var s = 0; s < this.decision.p.length; s++) {
          if (this.decision.p[s] === article) {
            this.decision.p.splice(s + 1, 0, inert(EMPTY_ARTICLE))
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
    LbArticle,
    LbParagraph,
    TextareaGrowing
  }
}
</script>
