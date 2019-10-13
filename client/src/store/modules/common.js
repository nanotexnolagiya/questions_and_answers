import { LOADING, ERRORS } from '../actions/common'

const state = {
  loading: false,
  errors: []
}

const getters = {
  loading: state => state.loading,
  errors: state => state.errors,
  modalBackground: state => state.modalBackground
}

const actions = {
  [LOADING]: ({ commit }, payload) => {
    commit(LOADING, payload)
  },
  [ERRORS]: ({ commit }, payload) => {
    commit(ERRORS, payload)
  }
}

const mutations = {
  [LOADING]: (state, payload) => {
    state.loading = payload
  },
  [ERRORS]: (state, payload) => {
    state.errors = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
