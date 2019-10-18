import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import auth from './modules/auth'
import categories from './modules/categories'
import appTransfer from './modules/appTransfer'
import appRecieve from './modules/appRecieve'
import things from './modules/things'
import properties from './modules/propertioes'

Vue.use(Vuex)

const debug = true

export default new Vuex.Store({
  modules: {
    common,
    user,
    auth,
    categories,
    appTransfer,
    appRecieve,
    things,
    properties
  },
  strict: debug
})
