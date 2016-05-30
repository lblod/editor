import InputRef from '../components/InputRef.vue'
import ItemRef from '../components/ItemRef.vue'
import ItemLookup from '../components/ItemLookup.vue'
import TextareaGrowing from '../components/TextareaGrowing.vue'

export default {
  computed: {
    prop () {
      return 'blub'
    },
    float () {
      return this.article.context !== 'lbld:legalBackground'
    },
    legal () {
      return this.article.text.slice(0, 7) === 'Gelet op'
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
        this.$dispatch('append', this.article)
        evt.preventDefault()
        this.$nextTick(function () {
          this.$el.nextElementSibling.querySelector('textarea').focus()
        })
      }
    },
    select (evt) {
      this.$broadcast('selectText', evt)
    },
    rm () {
      this.$dispatch('rm', this.article)
    }
  },
  attached () {
    if (!this.$root.keepFocus) {
      return
    }
    var inp = this.$el.querySelector('textarea')
    inp && inp.focus()
  },
  components: {
    InputRef,
    ItemRef,
    ItemLookup,
    TextareaGrowing
  }
}