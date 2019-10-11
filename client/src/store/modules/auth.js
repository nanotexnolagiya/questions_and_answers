/* eslint-disable promise/param-names */
import {
  AUTH_SIGNUP,
  AUTH_SIGNIN,
  AUTH_LOGOUT,
  AUTH_REQUEST,
  HAS_LOADED_ONCE
} from '../actions/auth'
import { USER_REQUEST } from '../actions/user'
import apiCall from '../../utils/api'

const state = {
  token: localStorage.getItem('user-token') || '',
  hasLoadedOnce: false
}

const getters = {
  isAuthenticated: state => !!state.token,
  hasLoadedOnce: state => state.hasLoadedOnce,
  token: state => state.token
}

const actions = {
  [HAS_LOADED_ONCE]: ({ commit }, payload) => {
    commit(HAS_LOADED_ONCE, payload)
  },
  [AUTH_SIGNUP]: async ({ commit, dispatch }, user) => {
    try {
      const res = await apiCall({
        url: '/auth/signup',
        method: 'post',
        data: user
      })

      localStorage.setItem('user-token', res.data.token)
      // Here set the header of your ajax library to the token value.
      // example with axios
      commit(AUTH_REQUEST, res.data)
      dispatch(USER_REQUEST)
    } catch (error) {
      throw error
    }
  },
  [AUTH_SIGNIN]: async ({ commit, dispatch }, user) => {
    try {
      const res = await apiCall({
        url: '/auth/signin',
        method: 'post',
        data: user
      })

      localStorage.setItem('user-token', res.data.token)

      commit(AUTH_REQUEST, res.data)
      dispatch(USER_REQUEST)
    } catch (error) {
      throw error
    }
  },
  [AUTH_LOGOUT]: async ({ commit }) => {
    try {
      localStorage.clear()
      console.log('localStorage clear')
      commit(AUTH_LOGOUT)
      console.log('store clear')
    } catch (error) {
      throw error
    }
  }
}

const mutations = {
  [AUTH_REQUEST]: (state, payload) => {
    state.token = payload.token
    state.role = payload.role
  },
  [AUTH_LOGOUT]: state => {
    state.token = ''
  },
  [HAS_LOADED_ONCE]: (state, payload) => {
    state.hasLoadedOnce = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
