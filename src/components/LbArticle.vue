<template>
  <article class="article article-numbered" :class="{'article-float':float, 'article-empty':!article.text}">
    <div class="article-text">
      <span class="article-number">Artikel {{ number }}.</span>
      <textarea-growing :model.sync="article.text" placeholder="Schrijf hier de inhoud van het artikel" @keydown.enter="enter" @select="select"></textarea-growing>
    </div>
    <div class="article-tools">
      <span class="ref-icon icon-times" @click="rm">&times;</span>
    </div>
    <div class="p-ref" v-if="float">
      <item-ref v-for="ref in article.refs" :ref="ref"></item-ref>
      <input-ref :model.sync="article.refs"></input-ref>
    </div>
    <div class="p-ref" v-else>
      <item-lookup v-for="ref in article.refs" :ref="ref"></item-lookup>
    </div>
  </article>
</template>

<script>
import Paragraph from '../mixins/Paragraph.js'

export default {
  props: ['article', 'num'],
  computed: {
    number () {
      var id = this.article['@id']
      return id.slice(Math.max(id.lastIndexOf('-'), id.lastIndexOf('#'), id.lastIndexOf(':')) + 1)
    }
  },
  mixins: [Paragraph]
}
</script>
