import InputRef from '../components/InputRef.vue'
import ItemRef from '../components/ItemRef.vue'
import TextareaGrowing from '../components/TextareaGrowing.vue'

export default {
	computed: {
		prop () {
			return 'blub'
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
          this.$el.parentElement.nextElementSibling.querySelector('textarea').focus()
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
  components: {
    InputRef,
    ItemRef,
    TextareaGrowing
  }
}