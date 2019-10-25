import apiCall from '../../utils/api'
import {
  FETCH_CATEGORIES_TREE,
  FETCH_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
  FETCH_CATEGORY_PROPERTIES
} from '../actions/categories'

const state = {
  categories: [],
  categoryProperties: []
}

const getters = {
  categories: state => state.categories,
  categoryProperties: state => state.categoryProperties,
  category: state => id =>
    state.categories.find(category => category.id === id)
}

const actions = {
  [FETCH_CATEGORIES_TREE]: async ({ commit, getters }) => {
    try {
      const res = await apiCall.get('/categories/tree', {
        params: {
          token: getters.token
        }
      })
      commit(FETCH_CATEGORIES, res.data.data)
    } catch (error) {
      throw error
    }
  },
  [FETCH_CATEGORY_PROPERTIES]: async ({ commit, getters }, payload) => {
    try {
      if (payload !== 'clear') {
        const res = await apiCall.get(`/categories/${payload}/properties`, {
          params: {
            token: getters.token
          }
        })
        commit(FETCH_CATEGORY_PROPERTIES, res.data.data)
      } else {
        commit(FETCH_CATEGORY_PROPERTIES, [])
      }
    } catch (error) {
      throw error
    }
  },
  [FETCH_CATEGORIES]: async ({ commit, getters }) => {
    try {
      const res = await apiCall.get('/categories', {
        params: {
          token: getters.token
        }
      })
      commit(FETCH_CATEGORIES, res.data.data)
    } catch (error) {
      throw error
    }
  },
  [ADD_CATEGORY]: async ({ getters }, category) => {
    try {
      await apiCall.post('/categories', category, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [UPDATE_CATEGORY]: async ({ getters }, category) => {
    try {
      await apiCall.put(`/categories/${category.id}`, category, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [REMOVE_CATEGORY]: async ({ getters }, id) => {
    try {
      await apiCall.delete(`/categories/${id}`, {
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
  [FETCH_CATEGORIES]: (state, payload) => {
    state.categories = payload
  },
  [FETCH_CATEGORY_PROPERTIES]: (state, payload) => {
    state.categoryProperties = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
