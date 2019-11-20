import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './plugins/bootstrap-vue'
import treeView from 'components/lib/tree-view'
import loading from 'components/lib/loading'
import pageLayout from 'components/lib/page-layout'
import { AUTH_LOGOUT } from 'actions/auth'
import { ERROR } from 'actions/common'

Vue.config.productionTip = false

Vue.component('tree-view', treeView)
Vue.component('loading', loading)
Vue.component('pageLayout', pageLayout)

Vue.filter('truncate', (text, stop, clamp) => {
  if (typeof text === 'string') {
    return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
  } else {
    return text
  }
})

Vue.config.errorHandler = function (err, vm, info) {
  if (err.response) {
    if (err.response.status === 401) {
      store.dispatch(AUTH_LOGOUT)
      location.href = '/signin'
    }
    console.error(err.response.data.message)
  }
  store.dispatch(ERROR, true)
  console.error(err)
  console.info(info)
}

window.onerror = function (message, source, line, column, error) {
  console.log('Start on err')
  console.log('Message', message)
  console.log('Source', source)
  console.log('Line', line)
  console.log('Column', column)
  console.log('Error', error)
  console.log('Response', error.response)
}

window.addEventListener('unhandledrejection', function (e) {
  if (e.reason.response) {
    if (e.reason.response.status === 401) {
      store.dispatch(AUTH_LOGOUT)
      location.href = '/signin'
    }
  }
})

/* eslint-disable */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
