<template>
  <article class="article article-numbered">
    <span class="article-number">Artikel {{ number }}.</span>
    <textarea-growing :model.sync="article.text" :placeholder="article['@id']?'Referentie naar '+article['@id']:'Schrijf hier de inhoud van het artikel'" @keydown.enter="enter"></textarea-growing>
    <div class="article-tools">
      <span class="ref-icon icon-times" @click="rm">&times;</span>
    </div>
    <div class="p-ref">
      <a href="#" class="p-ref-a" v-for="ref in article.refs">{{ref['@id']}}</a>
      <a href="#" class="p-ref-add">+&nbsp;verwijzing</a>
    </div>
  </article>
</template>

<script>
import TextareaGrowing from './TextareaGrowing.vue'

export default {
  props: ['article', 'num'],
  computed: {
    number () {
      return this.article['@id'].slice(this.article['@id'].indexOf('#') + 1)
    }
  },
  methods: {
    enter (evt) {
      if (evt.crtlKey || evt.shiftKey) {
        return
      }
      if (!this.article.text) {
        evt.preventDefault()
        return
      }
      if (this.$el.querySelector('textarea').selectionStart == this.article.text.length) {
        // Create new uri!
        this.$dispatch('append', this.article)
        evt.preventDefault()
        this.$nextTick(function () {
          this.$el.parentElement.nextElementSibling.querySelector('textarea').focus()
        })
      }
    },
    rm () {
      this.$dispatch('rm', this.article)
    }
  },
  components: {
    TextareaGrowing
  }
}
</script>
