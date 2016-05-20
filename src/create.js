import Vue from 'vue'
import VueResource from 'vue-resource'

import Create from './Create.vue'
import Fragments from './mixins/Fragments.js'

Vue.use(VueResource)
Vue.config.debug = true

new Vue({
  el: 'body',
  mixins: [Fragments],
  components: { Create }
})
