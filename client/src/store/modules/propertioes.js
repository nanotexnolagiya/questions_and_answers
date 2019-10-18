import apiCall from '../../utils/api'
import {
  FETCH_PROPERTIES,
  ADD_PROPERTY,
  REMOVE_PROPERTY,
  UPDATE_PROPERTY
} from '../actions/properties'

const state = {
  properties: []
}

const getters = {
  properties: state => state.properties,
  property: state => id =>
    state.properties.find(property => property.id === id),
}

const actions = {
  [FETCH_PROPERTIES]: async ({ commit, getters }) => {
    try {
      const res = await apiCall.get('/properties', {
        params: {
          token: getters.token
        }
      })
      commit(FETCH_PROPERTIES, res.data.data)
    } catch (error) {
      throw error
    }
  },
  [ADD_PROPERTY]: async ({ getters }, property) => {
    try {
      await apiCall.post('/properties', property, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [UPDATE_PROPERTY]: async ({ getters }, property) => {
    try {
      await apiCall.put(`/properties/${property.id}`, property, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [REMOVE_PROPERTY]: async ({ getters }, id) => {
    try {
      await apiCall.delete(`/properties/${id}`, {
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
  [FETCH_PROPERTIES]: (state, payload) => {
    state.properties = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
