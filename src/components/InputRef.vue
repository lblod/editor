<template>
  <form class="inp-ref" @submit.prevent.stop="submit" @keydown="keydown" @click.stop>
    <div v-if="prop" v-text="propText"></div>
    <div v-if="value" v-text="valueText"></div>
    <input type="text" :class="{focus:term||prop}" v-model="term" :placeholder="prop?'something':'link'" @click="input" @focus="input" @input="input">
    <div class="ref-select" v-if="options">
      <div class="ref-option" :class="{'ref-ghost':$index===ghost}" v-for="opt in options" v-text="text(opt)" track-by="$index" @mouseenter="ghost=$index" @mousedown="confirm(opt)" transition="staggered"></div>
    </div>
  </form> 
</template>

<script>
import Fuse from 'fuse.js'
import ItemRef from './ItemRef.vue'

var fuseOptions = {
  caseSensitive: false,
  shouldSort: true,
  tokenize: true,
  threshold: 0.5,
  location: 0,
  distance: 100,
  id: 'id'
}

export default {
  props: {
    model: {
      twoWay: true
    },
    placeholder: null
  },
  data () {
    return {
      ghost: 0,
      options: null,
      prop: null,
      propSearch: true,
      term: null,
      value: null
    }
  },
  computed: {
    propIndex () {
      fuseOptions.id = '@id'
      fuseOptions.keys = ['@id', '@value']
      return new Fuse(this.$root.props, fuseOptions)
    },
    index () {
      var fragments = Object.values(this.$root.fragments)
      if (this.prop) {
        var prop = this.$root.map[this.prop]
        console.log('index', this.prop, fragments.length)
        fragments = fragments.filter(f => prop.range.includes(f.type))
        if (this.prop === 'lbld:replaces') {
          fragments = fragments.filter(f => f.id.indexOf('#article') !== -1)
        }
      }
      fuseOptions.id = 'id'
      fuseOptions.keys = ['text']
      return new Fuse(fragments, fuseOptions)
    },
    propText () {
      var p = this.$root.map[this.prop]
      return p && p['rdfs:label'] && p['rdfs:label']['@value'] || this.prop
    },
    valueText () {
      var v = JSON.parse(JSON.stringify(this.value))
      if (!v) {
        return '?'
      }
      if (v['@id']) {
        v = this.$root.map[v['@id']] || v
      }
      return v['schema:name'] || v.text || v['@id'] || v || '??'
    },
    ref () {
      return {
        prop: this.prop,
        value: this.value
      }
    }
  },
  methods: {
    text (opt) {
      opt = this.$root.map[opt]
      return opt && (opt['rdfs:label'] && opt['rdfs:label']['@value'] || opt.text || opt['@id']) || 'errr'
    },
    blur () {
      var self = this
      setTimeout(function () {
        self.options = null
        self.ghost = 0
      }, 100)
    },
    input () {
      var needle = this.term 
      // if (!needle && !this.propSearch) {
      //   this.options = null
      //   this.ghost = 0
      //   return console.warn('no needle')
      // }
      if (needle || this.prop) {
        this.options = (this.propSearch ? this.propIndex : this.index).search(needle || ' ').slice(0, 20)
      } else {
        this.options = this.$root.props.map(p => p['@id']);
      }
      this.ghost = Math.min(this.ghost, this.options.length - 1)
    },
    keydown (evt) {
      let key = evt.which || evt.keyCode
      if (key === 9) {
        this.blur()
      } else if (key === 27) {
        this.propSearch = true
        this.prop = null
        this.value = null
        this.term = null
        this.blur()
      } else if (key === 38) {
        this.ghost = Math.max(this.ghost - 1, 0)
      } else if (key === 40) {
        this.ghost = Math.min(this.ghost + 1, (this.options && this.options.length || 1) - 1)
      }
    },
    submit (evt) {
      this.confirm()
      return false
    },
    confirm (uri) {
      var ref
      if (typeof uri === 'string') {
        ref = {'@id': uri}
      } else if (this.options && this.options[this.ghost]) {
        uri = this.options[this.ghost]
        ref = {'@id': uri}
      } else {
        ref = this.term
      }
      // Could use some refactoring
      if (ref) {
        if (this.propSearch) {
          this.prop = uri
          this.propSearch = false
        } else {
          this.value = ref
          this.propSearch = true
        }
        var self = this
        var inp = this.$el.querySelector('input')
        if (!this.prop || !this.value) {
          this.term = ''
          setTimeout(function () {
            if (inp == window.document.activeElement) {
              self.input()
            } else {
              inp.focus()
            }
          }, 30)
        }
      }
      if (!this.prop || !this.value) {
        return console.warn(this.prop, '==>', this.value)
      }
      this.add()
      this.term = null
      this.blur()
    },
    add () {
      console.log(this.prop, '===>', this.value)
      if (this.model) {
        this.model.push({prop: this.prop, value: this.value})
        this.prop = null
        this.value = null
        this.propSearch = true
      } else {
        console.error('no model?')
      }
    }
  },
  events: {
    blurred () {
      this.options = null
      this.ghost = 0
    },
    selectText (evt) {
      var text = evt.target.value.slice(evt.target.selectionStart, evt.target.selectionEnd)

      // Smart middleware
      var match = /\b\d+\s\w+\s(20|19|18)\d{2}\b/.exec(text)
      if (match) {
        this.prop = 'dcterms:temporal'
        this.value = match[0]
        this.add()
        // this.propSearch = true
        // this.term = 
        // this.$el.querySelector('input').focus()
        return console.log(match)
      }

      match = /gemeentedecreet/i.exec(text)
      if (match) {
        console.log('mwut')
      }

      // Just fill in value
      this.term = text
      this.propSearch = false
      this.input()
    }
  },
  components: {
    ItemRef
  }
}
</script>
