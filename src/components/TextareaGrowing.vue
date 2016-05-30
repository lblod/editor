<template>
  <textarea v-model="model" :placeholder="placeholder" @input="input" @keydown="keep"></textarea>
</template>

<script>
export default {
  props: ['model', 'placeholder'],
  methods: {
    input () {
      this.$el.style.marginBottom = (this.height || this.$el.scrollHeight + 5) + 'px'
      this.$el.style.height = '1px'
      this.height = this.$el.scrollHeight
      this.$el.style.height = Math.min(this.height, 500) + 'px'
      this.$el.style.marginBottom = null
    },
    keep () {
      let root = this.$root
      root.keepFocus = setTimeout(function () {
        clearTimeout(root.keepFocus)
        root.keepFocus=0
      }, 1000)
    }
  },
  attached () {
    this.input()
  },
  watch: {
    model () {
      this.input()
    }
  }
}
</script>
