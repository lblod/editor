<template>
  <div id="app">
    <div class="header">
      <div class="page-container">
        <h1>Besluit opmaken</h1>
        <nav>
          <a href="index.html">zoek</a>
          <a href="create.html">schrijf</a>
          <a href="bertem.html">bertem</a>
        </nav>
      </div>
    </div>
    <div class="page-container">
      <div class="page">
        <textarea-growing style="font-size:1.5rem;" :model.sync="decision['dcterms:title']" placeholder="Titel van het besluit"></textarea-growing>
        <section class="section" v-for="p in decision.p" track-by="$index">
          <h2 v-if="p.title" class="section-title">{{p.title}}</h2>
          <lb-article v-if="p.type=='lbld:Article'" :article.sync="p"></lb-article>
          <lb-paragraph v-if="p.type!=='lbld:Article'&&!p.title" :article.sync="p"></lb-paragraph>
        </section>
        <button type="button" @click="save">Bewaren</button>
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
  // initialDecision = JSON.parse(window.localStorage.getItem('decision'))
} catch (e) {}
initialDecision = initialDecision || {
  '@type': 'lbld:Decision',
  '@id': '_:decision-163',
  'dcterms:title': 'Eedaflegging en installatie gemeenteraadslid',
  'schema:author': 'Petra Verhenne',
  'dcterms:title': 'Gemeenteraad - Ontslag gemeenteraadslid - Aktename',
  'schema:description': 'Op 15 juni 2014 liet de heer Bart Caron weten dat hij ontslag neemt als gemeenteraadslid. In vervanging van de heer Bart Caron dient een opvolger geïnstalleerd te worden. De heer Mattias Vandemaele, eerste opvolger op de lijst Groen, is bereid het mandaat van gemeenteraadslid op te nemen in opvolging van de heer Bart Caron.',
  p: [{
    title: 'Aanleiding',
    context: 'lbld:aanleiding'
  }, {
    text: 'Op 15 juni 2014 liet de heer Bart Caron weten dat hij ontslag neemt als gemeenteraadslid. De gemeenteraad nam daarvan akte in huidige zitting.'
  }, {
    title: 'Argumentatie',
    context: 'lbld:Motivation'
  }, {
    text: 'Volgens het proces-verbaal... Hier komt een copy/paste van elders: Op 15 juni 2014 liet de heer Bart Caron weten dat hij ontslag neemt als gemeenteraadslid.\n\nIn vervanging van de heer Bart Caron dient een opvolger geïnstalleerd te worden. De heer Mattias Vandemaele, eerste opvolger op de lijst Groen, is bereid het mandaat van gemeenteraadslid op te nemen in opvolging van de heer Bart Caron.Op 15 juni 2014 liet de heer Bart Caron weten dat hij ontslag neemt als gemeenteraadslid. In vervanging van de heer Bart Caron dient een opvolger geïnstalleerd te worden. De heer Mattias Vandemaele, eerste opvolger op de lijst Groen, is bereid het mandaat van gemeenteraadslid op te nemen in opvolging van de heer Bart Caron.\n\nOp 15 juni 2014 liet de heer Bart Caron weten dat hij ontslag neemt als gemeenteraadslid. In vervanging van de heer Bart Caron dient een opvolger geïnstalleerd te worden. De heer Mattias Vandemaele, eerste opvolger op de lijst Groen, is bereid het mandaat van gemeenteraadslid op te nemen in opvolging van de heer Bart Caron.'
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
    context: 'lbld:decision'
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
      decision: initialDecision || {}
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
          this.decision.p.splice(s, 1)
          return
        }
      }
    }
  },
  methods: {
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
