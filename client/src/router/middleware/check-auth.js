
import { USER_REQUEST } from 'actions/user'
import { HAS_LOADED_ONCE } from 'actions/auth'
import store from '../../store'

export default async (to, from, next) => {
  if (!store.getters.hasLoadedOnce) {
    await store.dispatch(HAS_LOADED_ONCE, true)
    if (store.getters.isAuthenticated) {
      await store.dispatch(USER_REQUEST)

      next()
      return
    }
    next('/signin')
  }
  next()
}
