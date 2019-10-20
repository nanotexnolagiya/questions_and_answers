import { FETCH_STATUSES, UPDATE_STATUS } from '../actions/statuses'
import apiCall from '../../utils/api'

const state = {
  statuses: []
}

const getters = {
  statuses: state => state.statuses,
  status: state => id => state.statuses.find(status => status.id === id)
}

const actions = {
  [FETCH_STATUSES]: async ({ commit, getters }) => {
    try {
      const res = await apiCall.get('/statuses', { params: {
        token: getters.token
      } })
      commit(FETCH_STATUSES, res.data.data)
    } catch (error) {
      throw error
    }
  },
  [UPDATE_STATUS]: async ({ getters }, payload) => {
    try {
      await apiCall.put('/statuses/' + payload.id, payload, {
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
  [FETCH_STATUSES]: (state, payload) => {
    state.statuses = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
