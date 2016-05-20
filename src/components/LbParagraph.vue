<template>
  <article class="article">
    <textarea-growing :model.sync="article.text" placeholder="Lege paragraaf" @keydown.enter="enter" @select="select"></textarea-growing>
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
  props: ['article'],
  mixins: [Paragraph]
}
</script>
