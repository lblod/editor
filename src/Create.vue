<template>
  <div id="app">
    <div class="header">
      <div class="page-container">
        <nav>
          <a href="#" :class="{active:!json}" @click.prevent="json=0">Editor</a>
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
            <select class="inp-text inp-select">
              <option>Gemeenteraad</option>
            </select>
          </label>
          <label class="inp">
            <span class="inp-label">Aard</span>
            <select class="inp-text inp-select">
              <option>Mandaat</option>
            </select>
          </label>
          <label class="inp">
            <span class="inp-label">Soort</span>
            <select class="inp-text inp-select">
              <option>Aktename ontslag</option>
            </select>
          </label>
          <label class="inp">
            <span class="inp-label">Auteur</span>
            <input class="inp-text" type="text" v-model="decision['schema:author']['schema:name']">
          </label>
          <label class="inp">
            <span class="inp-label">Beleidsveld</span>
            <input class="inp-text" type="text" v-model="decision['lbld:beleidsveld']">
          </label>
          <label class="inp">
            <span class="inp-label">Toepassingsgebied</span>
            <input class="inp-text" type="text" v-model="decision['dcterms:spatial']" placeholder="todo:geopicker">
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
        <textarea-growing style="font-size:1.5rem;margin-top:2rem;" :model.sync="decision['dcterms:title']" placeholder="Titel van het besluit"></textarea-growing>
        <section class="section" v-for="p in decision.p" track-by="$index">
          <h2 v-if="p.title" class="section-title">{{p.title}}</h2>
          <lb-article v-if="p.type=='lbld:Article'" :article.sync="p"></lb-article>
          <lb-paragraph v-if="p.type!=='lbld:Article'&&!p.title" :article.sync="p"></lb-paragraph>
        </section>
        <div class="page-footer">
          <button type="button" @click="save">Bewaren</button>
          <button type="button" @click="reset">Reset</button>
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
  return JSON.parse(JSON.stringify(obj))
}

var initialDecision 
try {
  initialDecision = JSON.parse(window.localStorage.getItem('decision'))
} catch (e) {}
initialDecision = initialDecision || {
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
    title: 'Aanleiding',
    context: 'lbld:aanleiding'
  }, {
    text: 'Op 15 juni 2014 liet de heer Bart Caron weten dat hij ontslag neemt als gemeenteraadslid. De gemeenteraad nam daarvan akte in huidige zitting.'
  }, {
    title: 'Argumentatie',
    context: 'lbld:Motivation'
  }, {
    text: 'Volgens het proces-verbaal van het hoofdstembureau van Kortrijk houdende vaststelling van de zetelverdeling tussen de lijsten en van de rangorde van de raadsleden en hun opvolgers, d.d. 14 oktober 2012, zoals geldig verklaard bij besluit van de Raad voor Verkiezingsbetwistingen van 21 december 2012, is de heer Mattias Vandemaele de eerste opvolger.\nDe heer Mattias Vandemaele is bereid het mandaat van gemeenteraadslid op te nemen in opvolging van de heer Bart Caron.\n\nDe raad gaat over tot het onderzoek van de geloofsbrieven. Daartoe wordt de zitting geschorst van xx tot xx. De geloofsbrieven worden onderzocht door de twee jongste raadsleden S. Vanneste en A. Vandendriesche.\nDe raad gaat vervolgens over tot de stemming over het onderzoek van de geloofsbrieven, waarvan de uitslag luidt als volgt: xx\n\nVervolgens gaat de heer Mattias Vandemaele over tot de eedaflegging in handen van de voorzitter, waarvan de tekst conform artikel 7 §3 van het gemeentedecreet luidt als volgt: "Ik zweer de verplichtingen van mijn mandaat trouw na te komen". Van deze eedaflegging wordt een proces-verbaal opgemaakt.'
  }, {
    title: 'Juridische grond',
    context: 'lbld:juridisch'
  }, {
    text: 'We verwijzen hierbij naar de bepalingen van het gemeentedecreet en het kiesdecreet.',
    refs: [{
      '@id': '_:kiesdecreet'
    }, {
      '@id': '_:gemeentedecreet'
    }]
  }, {
    title: 'Bevoegdheid',
    context: 'lbld:bevoegd'
  }, {
    text: 'De GR is bevoegd op basis van artikel 42-43 van het gemeentedecreet.',
    refs: [{
      '@id': '_:gemeentedecreet#42'
    }, {
      '@id': '_:gemeentedecreet#43'
    }]
  }, {
    title: 'Besluit',
    context: 'lbld:article'
  }, {
    'type': 'lbld:Article',
    '@id': '_:decision-163#1',
    text: 'De geloofsbrieven van de heer Mattias Vandemaele goed te keuren.',
    refs: [{
      '@id': '_:decision-163#1'
    }]
  }, {
    'type': 'lbld:Article',
    '@id': '_:decision-163#2',
    text: 'Akte te nemen van het proces-verbaal van eedaflegging van de heer Mattias Vandemaele.',
    refs: [{
      '@id': '_:decision-163#2'
    }]
  }, {
    'type': 'lbld:Article',
    '@id': '_:decision-163#3',
    text: 'De heer Mattias Vandemaele te installeren als gemeenteraadslid.',
    refs: [{
      '@id': '_:decision-163#3'
    }]
  }, {
    'type': 'lbld:Article',
    '@id': '_:decision-163#4',
    text: 'Huidige beslissing binnen de twintig dagen mee te delen aan de Vlaamse Regering.',
    refs: [{
      '@id': '_:decision-163#4'
    }]
  }, {
    title: 'Bijlagen',
    context: null
  }, {
    text: ''
  }]
}

export default {
  data () {
    return {
      decision: initialDecision || {},
      json: 0
    }
  },
  computed: {
    jsonld () {
      var decision = inert(this.decision);
      var context

      // Loop over paragraphs and pick up refs based on context
      for (var i = 0; i < decision.p.length; i++) {
        let p = decision.p[i]

        // Title defines the context of the underlying articles
        if (p.title) {
          context = p.context
        }

        // Title defines the context of the underlying articles
        if (context && p.refs) {
          if (!decision[context]) {
            decision[context] = []
          }
          decision[context] = decision[context].concat(p.refs)
        }
        
      }
      delete decision.p
      return decision
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
  methods: {
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
  components: {
    LbArticle,
    LbParagraph,
    TextareaGrowing
  }
}
</script>
