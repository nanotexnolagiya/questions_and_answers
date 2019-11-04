import apiCall from '../../utils/api'
import {
  FETCH_THINGS,
  FETCH_THING_BY_ID,
  ADD_THING,
  UPDATE_THING,
  REMOVE_THING
} from '../actions/things'

const state = {
  things: [],
  thing: null
}

const getters = {
  things: state => state.things,
  thing: state => state.thing,
  thingById: state => id => state.things.find(thing => id === thing.id)
}

const actions = {
  [FETCH_THINGS]: async ({ getters, commit }, payload) => {
    try {
      const res = await apiCall.get('/things', {
        params: {
          token: getters.token,
          ...payload
        }
      })

      commit(FETCH_THINGS, res.data.data)
      return res.data
    } catch (error) {
      throw error
    }
  },
  [FETCH_THING_BY_ID]: async ({ getters, commit }, id) => {
    try {
      const res = await apiCall.get('/things/' + id, {
        params: {
          token: getters.token
        }
      })

      commit(FETCH_THING_BY_ID, res.data.data)
    } catch (error) {
      throw error
    }
  },
  [ADD_THING]: async ({ getters }, payload) => {
    try {
      await apiCall.post('/things', payload, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [UPDATE_THING]: async ({ getters }, payload) => {
    try {
      await apiCall.put('/things/' + payload.id, payload, {
        params: {
          token: getters.token
        }
      })
    } catch (error) {
      throw error
    }
  },
  [REMOVE_THING]: async ({ getters }, id) => {
    try {
      await apiCall.delete('/things/' + id, {
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
  [FETCH_THINGS]: (state, payload) => {
    state.things = payload
  },
  [FETCH_THING_BY_ID]: (state, payload) => {
    state.thing = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
