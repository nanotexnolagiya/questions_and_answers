import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import auth from './modules/auth'
import categories from './modules/categories'
Vue.use(Vuex)

const debug = true

export default new Vuex.Store({
  modules: {
    common,
    user,
    auth,
    categories
  },
  strict: debug
})
