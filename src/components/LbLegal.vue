<template>
  <article class="article" :class="{'article-legal':art}">
    <div class="article-expand" v-if="art" @click="show=!show">&rarr;</div>
    <div class="article-text">
      <textarea-growing :model.sync="article.text" @keydown.enter="enter" @focus="show=true" @blur="show=false"></textarea-growing>
    </div>
    <div class="article-tools">
      <span class="ref-icon icon-times" @click="rm">&times;</span>
    </div>
    <p v-if="show&&art" v-text="art.text" class="item-lookup-text"></p>
  </article>
</template>

<script>
import Paragraph from '../mixins/Paragraph.js'

export default {
  props: ['article'],
  data () {
    return {
      show: false
    }
  },
  computed: {
    id () {
      var v = JSON.parse(JSON.stringify(this.article.text))
      if (!v) {
        return '?'
      }
      if (v.indexOf('emeentedecreet') !== -1 && v.indexOf('rtikel') !== -1) {
        var a = v.slice(v.indexOf('rtikel ') + 7)
        if (a.indexOf(' v') > 0) a = a.slice(0, a.indexOf(' '))
        if (a.indexOf(',') > 0) a = a.slice(0, a.indexOf(','))
        return '_:gemeentedecreet-' + a
      }
    },
    art () {
      var v = this.id
      var art = this.$root.gemeentedecreet && this.$root.gemeentedecreet[v]
      if (art) {
        art.title = 'Gemeentedecreet Art. ' + v.slice(18)
        return art
      }
    }
  },
  mixins: [Paragraph]
}
</script>
