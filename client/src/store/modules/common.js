import { LOADING, ERRORS, MODAL_BACKGROUND } from '../actions/common'

const state = {
  loading: false,
  modalBackground: false,
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
  },
  [MODAL_BACKGROUND]: ({ commit }, payload) => {
    commit(MODAL_BACKGROUND, payload)
  }
}

const mutations = {
  [LOADING]: (state, payload) => {
    state.loading = payload
  },
  [ERRORS]: (state, payload) => {
    state.errors = payload
  },
  [MODAL_BACKGROUND]: (state, payload) => {
    state.modalBackground = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
