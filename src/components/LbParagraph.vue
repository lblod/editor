<template>
  <article class="article">
    <textarea-growing :model.sync="article.text" placeholder="Lege paragraaf" @keydown.enter="enter"></textarea-growing>
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
  props: ['article'],
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
