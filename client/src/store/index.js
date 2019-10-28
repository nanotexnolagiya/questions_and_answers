import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import auth from './modules/auth'
import categories from './modules/categories'
import appTransfer from './modules/appTransfer'
import appReceive from './modules/appReceive'
import things from './modules/things'
import properties from './modules/properties'
import statuses from './modules/statuses'

Vue.use(Vuex)

const debug = true

export default new Vuex.Store({
  modules: {
    common,
    user,
    auth,
    categories,
    appTransfer,
    appReceive,
    things,
    properties,
    statuses
  },
  strict: debug
})
