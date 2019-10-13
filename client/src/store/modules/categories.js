import apiCall from '../../utils/api'
import {
  FETCH_CATEGORIES_TREE,
  FETCH_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY
} from '../actions/categories'

const state = {
  categories: []
}

const getters = {
  categories: state => state.categories,
  category: state => id =>
    state.categories.find(category => category.id === id),
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
