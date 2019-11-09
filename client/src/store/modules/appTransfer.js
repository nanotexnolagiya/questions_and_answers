import apiCall from '../../utils/api'
import {
  FETCH_APP_TRANSFERS,
  FETCH_APP_TRANSFER_BY_ID,
  ADD_APP_TRANSFER,
  UPDATE_APP_TRANSFER,
  REMOVE_APP_TRANSFER,
  ADD_UPLOADS,
  FETCH_UPLOADS,
  FETCH_ACCOUNT_APP_TRANSFERS,
  FETCH_ACCOUNT_APP_TRANSFER_BY_ID,
  ADD_ACCOUNT_APP_TRANSFER,
  UPDATE_ACCOUNT_APP_TRANSFER,
  REMOVE_ACCOUNT_APP_TRANSFER,
  FETCH_SUPPLIER_APP_TRANSFERS,
  FETCH_SUPPLIER_APP_TRANSFERS_CONFIRMED,
  FETCH_SUPPLIER_APP_TRANSFERS_DELIVERED,
  SET_SEPPLIER_APP_TRANSFER_IN_THE_WAY,
  SET_SEPPLIER_APP_TRANSFER_DELIVERED
} from '../actions/appTransfer'

const state = {
  appTransfers: [],
  appTransfer: null,
  uploads: []
}

const getters = {
  appTransfers: state => state.appTransfers,
  appTransfer: state => state.appTransfer,
  appTransferById: state => id => state.appTransfers.find(appTransfer => id === appTransfer.id),
  uploads: state => state.uploads
}

const actions = {
  [FETCH_APP_TRANSFERS]: async ({ getters, commit }, payload) => {
    try {
      const res = await apiCall.get('/app-transfers', {
        params: {
          token: getters.token,
          ...payload
        }
      })

      commit(FETCH_APP_TRANSFERS, res.data.data)

      return res.data
    } catch (error) {
      throw error
    }
  },
  [FETCH_APP_TRANSFER_BY_ID]: async ({ getters, commit }, id) => {
    try {
      const res = await apiCall.get('/app-transfers/' + id, {
        params: {
          token: getters.token
        }
      })

      commit(FETCH_APP_TRANSFER_BY_ID, res.data.data)
    } catch (error) {
      throw error
    }
  },
  [ADD_UPLOADS]: async ({ getters, commit }, payload) => {
    try {
      const res = await apiCall.post('/uploads', payload, {
        params: {
          token: getters.token
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      commit(FETCH_UPLOADS, res.data.data)
    } catch (error) {
      throw error
    }
  },
  [ADD_APP_TRANSFER]: async ({ getters }, payload) => {
    try {
      await apiCall.post('/app-transfers', payload, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [UPDATE_APP_TRANSFER]: async ({ getters }, payload) => {
    try {
      await apiCall.put('/app-transfers/' + payload.id, payload, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [REMOVE_APP_TRANSFER]: async ({ getters }, id) => {
    try {
      await apiCall.delete('/app-transfers/' + id, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [FETCH_ACCOUNT_APP_TRANSFERS]: async ({ getters, commit }, payload) => {
    try {
      const res = await apiCall.get('/account/app-transfers', {
        params: {
          token: getters.token,
          ...payload
        }
      })

      commit(FETCH_APP_TRANSFERS, res.data.data)

      return res.data
    } catch (error) {
      throw error
    }
  },
  [FETCH_ACCOUNT_APP_TRANSFER_BY_ID]: async ({ getters, commit }, id) => {
    try {
      const res = await apiCall.get('/account/app-transfers/' + id, {
        params: {
          token: getters.token
        }
      })

      commit(FETCH_APP_TRANSFER_BY_ID, res.data.data)
    } catch (error) {
      throw error
    }
  },
  [ADD_ACCOUNT_APP_TRANSFER]: async ({ getters }, payload) => {
    try {
      await apiCall.post('/account/app-transfers', payload, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [UPDATE_ACCOUNT_APP_TRANSFER]: async ({ getters }, payload) => {
    try {
      await apiCall.put('/account/app-transfers/' + payload.id, payload, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [REMOVE_ACCOUNT_APP_TRANSFER]: async ({ getters }, id) => {
    try {
      await apiCall.delete('/account/app-transfers/' + id, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [FETCH_SUPPLIER_APP_TRANSFERS]: async ({ getters, commit }, payload) => {
    try {
      const res = await apiCall.get('/supplier/app-transfers', {
        params: {
          token: getters.token,
          ...payload
        }
      })

      commit(FETCH_APP_TRANSFERS, res.data.data)

      return res.data
    } catch (error) {
      throw error
    }
  },
  [FETCH_SUPPLIER_APP_TRANSFERS_DELIVERED]: async ({ getters, commit }, payload) => {
    try {
      const res = await apiCall.get('/supplier/app-transfers/delivered', {
        params: {
          token: getters.token,
          ...payload
        }
      })

      commit(FETCH_APP_TRANSFERS, res.data.data)

      return res.data
    } catch (error) {
      throw error
    }
  },
  [FETCH_SUPPLIER_APP_TRANSFERS_CONFIRMED]: async ({ getters, commit }, payload) => {
    try {
      const res = await apiCall.get('/supplier/app-transfers/confirmed', {
        params: {
          token: getters.token,
          ...payload
        }
      })

      commit(FETCH_APP_TRANSFERS, res.data.data)

      return res.data
    } catch (error) {
      throw error
    }
  },
  [SET_SEPPLIER_APP_TRANSFER_IN_THE_WAY]: async ({ getters }, id) => {
    try {
      await apiCall.put(`/supplier/app-transfers/${id}/in-the-way`, {}, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [SET_SEPPLIER_APP_TRANSFER_DELIVERED]: async ({ getters }, id) => {
    try {
      await apiCall.put(`/supplier/app-transfers/${id}/delivered`, {}, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
}

const mutations = {
  [FETCH_APP_TRANSFERS]: (state, payload) => {
    state.appTransfers = payload
  },
  [FETCH_UPLOADS]: (state, payload) => {
    state.uploads = payload
  },
  [FETCH_APP_TRANSFER_BY_ID]: (state, payload) => {
    state.appTransfer = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
