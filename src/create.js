import Vue from 'vue'
import VueResource from 'vue-resource'

import Create from './Create.vue'

Vue.use(VueResource)
Vue.config.debug = true

new Vue({
  el: 'body',
  components: { Create }
})
