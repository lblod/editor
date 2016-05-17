<template>
  <textarea v-model="model" :placeholder="placeholder" @input="input"></textarea>
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
    }
  },
  attached () {
    this.input()
  }
}
</script>
