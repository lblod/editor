<template>
  <form class="inp-mandaat" @submit.prevent.stop="submit" @keydown="keydown">
    <input class="inp-text" type="text" v-model="term" :placeholder="placeholder" @blur="blur" @input="input">
    <div class="ref-select" v-if="options">
      <div class="ref-option" :class="{'ref-ghost':$index===ghost}" v-for="opt in options" v-text="opt.text" track-by="$index" @mouseenter="ghost=$index" @mousedown="confirm(opt)" transition="staggered"></div>
    </div>
  </form> 
</template>

<script>
import Fuse from 'fuse.js'

var fuseOptions = {
  caseSensitive: false,
  include: ['score'],
  shouldSort: true,
  tokenize: false,
  threshold: 0.5,
  location: 0,
  distance: 100,
  id: 'id',
  keys: ['text']
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
      term: null,
      options: null,
      ghost: 0
    }
  },
  computed: {
    index () {
      var fragments = this.$root.fragments.filter(x => x['@type'] === 'schema:Person').map(this.lookup)
      return new Fuse(fragments, fuseOptions)
    }
  },
  methods: {
    lookup (p) {
      let person = this.$root.map[p.item || p.id]
      return {
        id: person.id,
        text: person['schema:name']
      }
    },
    blur () {
      var self = this
      setTimeout(function () {
        self.term = null
        self.options = null
        self.ghost = 0
      }, 100)
    },
    input () {
      var needle = this.term
      if (!needle) {
        this.options = null
        this.ghost = 0
        return
      }
      this.options = this.index.search(needle).slice(0, 20).map(this.lookup)
      this.ghost = Math.min(this.ghost, (this.options.length || 1) - 1)
    },
    keydown (evt) {
      let key = evt.which || evt.keyCode
      // key up&down
      if (key === 9) {
        this.confirm()
      } else if (key === 38) {
        this.ghost = Math.max(this.ghost - 1, 0)
      } else if (key === 40) {
        this.ghost = Math.min(this.ghost + 1, this.options.length - 1)
      }
    },
    submit (evt) {
      this.confirm()
      return false
    },
    confirm (uri) {
      if (typeof uri === 'object') {
        this.model =  this.$root.map[uri.id]
        this.blur()
      } else if (!uri && this.options) {
        this.model =  this.$root.map[this.options[this.ghost].id]
        this.blur()
      } else {
        console.log('confirming but dont know what', uri)
      }
      if (this.model) {
        this.model.name = this.model['schema:name']
      }
    }
  }
}
</script>

<style>
.inp-mandaat {
  position: relative;
  flex-grow: 1;
  display: flex;
}
.ref-select {
  position: absolute;
  z-index: 20;
  top: 100%;
  left: -3px;
  margin-top: 3px;
  min-width: calc(100% + 6px);
  background-color: #F3F3F3;
  color: black;
  white-space: normal;
}
.ref-option {
  padding: 0 10px;
  white-space: nowrap;
  line-height: 34px;
  height: 34px;
}
.ref-ghost {
  background-color: #E6E6E6;
}

.staggered-transition {
  transition: opacity .5s ease, height .5s ease;
  overflow: hidden;
}
.staggered-enter, .staggered-leave {
  opacity: 0;
  height: 0;
}
</style>