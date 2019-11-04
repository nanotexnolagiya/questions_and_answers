import apiCall from '../../utils/api'
import {
  FETCH_APP_RECEIVES,
  FETCH_APP_RECEIVE_BY_ID,
  ADD_APP_RECEIVE,
  UPDATE_APP_RECEIVE,
  REMOVE_APP_RECEIVE,
  FETCH_ACCOUNT_APP_RECEIVES,
  FETCH_ACCOUNT_APP_RECEIVE_BY_ID,
  ADD_ACCOUNT_APP_RECEIVE,
  UPDATE_ACCOUNT_APP_RECEIVE,
  REMOVE_ACCOUNT_APP_RECEIVE
} from '../actions/appReceive'

const state = {
  appReceives: [],
  appReceive: null
}

const getters = {
  appReceives: state => state.appReceives,
  appReceive: state => state.appReceive,
  appReceiveById: state => id => state.appReceives.find(appReceive => id === appReceive.id)
}

const actions = {
  [FETCH_APP_RECEIVES]: async ({ getters, commit }, payload) => {
    try {
      const res = await apiCall.get('/app-receives', {
        params: {
          token: getters.token,
          ...payload
        }
      })

      commit(FETCH_APP_RECEIVES, res.data.data)
      return res.data
    } catch (error) {
      throw error
    }
  },
  [FETCH_APP_RECEIVE_BY_ID]: async ({ getters, commit }, id) => {
    try {
      const res = await apiCall.get('/app-receives/' + id, {
        params: {
          token: getters.token
        }
      })

      commit(FETCH_APP_RECEIVE_BY_ID, res.data.data)
    } catch (error) {
      throw error
    }
  },
  [ADD_APP_RECEIVE]: async ({ getters }, payload) => {
    try {
      await apiCall.post('/app-receives', payload, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [UPDATE_APP_RECEIVE]: async ({ getters }, payload) => {
    try {
      await apiCall.put('/app-receives/' + payload.id, payload, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [REMOVE_APP_RECEIVE]: async ({ getters }, id) => {
    try {
      await apiCall.delete('/app-receives/' + id, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  // -------------------------------------------------------------
  [FETCH_ACCOUNT_APP_RECEIVES]: async ({ getters, commit }, payload) => {
    try {
      const res = await apiCall.get('/account/app-receives', {
        params: {
          token: getters.token,
          ...payload
        }
      })

      commit(FETCH_APP_RECEIVES, res.data.data)
      return res.data
    } catch (error) {
      throw error
    }
  },
}

const mutations = {
  [FETCH_APP_RECEIVES]: (state, payload) => {
    state.appReceives = payload
  },
  [FETCH_APP_RECEIVE_BY_ID]: (state, payload) => {
    state.appReceive = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
