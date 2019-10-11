import { USER_REQUEST } from '../actions/user'
import apiCall from '../../utils/api'
import { AUTH_LOGOUT } from '../actions/auth'

const state = {
  user: null
}

const getters = {
  user: state => state.user,
  role: state => state.user ? state.user.Role.code : ''
}

const actions = {
  [USER_REQUEST]: async ({ commit, getters }) => {
    try {
      const res = await apiCall.post('/users/me', { token: getters.token })
      commit(USER_REQUEST, res.data)
    } catch (error) {
      throw error
    }
  }
}

const mutations = {
  [USER_REQUEST]: (state, payload) => {
    state.user = payload
  },
  [AUTH_LOGOUT]: state => {
    state.user = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
