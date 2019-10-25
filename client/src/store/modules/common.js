import { LOADING, ERROR } from '../actions/common'

const state = {
  loading: false,
  error: false
}

const getters = {
  loading: state => state.loading,
  error: state => state.error,
  modalBackground: state => state.modalBackground
}

const actions = {
  [LOADING]: ({ commit }, payload) => {
    commit(LOADING, payload)
  },
  [ERROR]: ({ commit }, payload) => {
    commit(ERROR, payload)
  }
}

const mutations = {
  [LOADING]: (state, payload) => {
    state.loading = payload
  },
  [ERROR]: (state, payload) => {
    state.error = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
