import { USER_REQUEST, FETCH_USERS, ADD_USER, UPDATE_USER, REMOVE_USER, FETCH_ROLES } from '../actions/user'
import apiCall from '../../utils/api'
import { AUTH_LOGOUT } from '../actions/auth'

const state = {
  profile: null,
  users: [],
  roles: []
}

const getters = {
  profile: state => state.profile,
  role: state => state.profile ? state.profile.Role.code : '',
  users: state => state.users,
  user: state => id => state.users.find(user => user.id === id),
  roles: state => state.roles
}

const actions = {
  [USER_REQUEST]: async ({ commit, getters }) => {
    try {
      const res = await apiCall.post('/users/me', { token: getters.token })
      commit(USER_REQUEST, res.data)
    } catch (error) {
      throw error
    }
  },
  [FETCH_USERS]: async ({ commit, getters }) => {
    try {
      const res = await apiCall.get('/users', { token: getters.token })
      commit(FETCH_USERS, res.data.data)
    } catch (error) {
      throw error
    }
  },
  [FETCH_ROLES]: async ({ commit, getters }) => {
    try {
      const res = await apiCall.get('/roles', { token: getters.token })
      commit(FETCH_ROLES, res.data.data)
    } catch (error) {
      throw error
    }
  },
  [ADD_USER]: async ({ getters }, user) => {
    try {
      await apiCall.post('/users', user, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [UPDATE_USER]: async ({ getters }, user) => {
    try {
      await apiCall.put(`/users/${user.id}`, user, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [REMOVE_USER]: async ({ getters }, id) => {
    try {
      await apiCall.delete(`/users/${id}`, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  }
}

const mutations = {
  [USER_REQUEST]: (state, payload) => {
    state.profile = payload
  },
  [FETCH_USERS]: (state, payload) => {
    state.users = payload
  },
  [FETCH_ROLES]: (state, payload) => {
    state.roles = payload
  },
  [AUTH_LOGOUT]: state => {
    state.profile = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
