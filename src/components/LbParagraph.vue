<template>
  <article class="article" :class="{'article-float':float}">
    <div class="article-text">
      <textarea-growing :model.sync="article.text" placeholder="Lege paragraaf" @keydown.enter="enter" @select="select"></textarea-growing>
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
  props: ['article'],
  mixins: [Paragraph]
}
</script>
