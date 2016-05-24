<template>
  <article class="article article-numbered">
    <div class="article-text">
      <span class="article-number">Artikel {{ number }}.</span>
      <textarea-growing :model.sync="article.text" :placeholder="article['@id']?'Referentie naar '+article['@id']:'Schrijf hier de inhoud van het artikel'" @keydown.enter="enter" @select="select"></textarea-growing>
    </div>
    <div class="article-tools">
      <span class="ref-icon icon-times" @click="rm">&times;</span>
    </div>
    <div class="p-ref">
      <item-ref v-for="ref in article.refs" :ref="ref"></item-ref>
      <input-ref :model.sync="article.refs"></input-ref>
    </div>
  </article>
</template>

<script>
import Paragraph from '../mixins/Paragraph.js'

export default {
  props: ['article', 'num'],
  computed: {
    number () {
      return this.article['@id'].slice(this.article['@id'].indexOf('#') + 1)
    }
  },
  mixins: [Paragraph]
}
</script>
