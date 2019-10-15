
import store from '../../store'
export const isNotAuth = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

export const isAuth = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/signin')
}

export const isRole = (role) => {
  return (to, from, next) => {
    if (store.getters.role === role) {
      next()
      return
    }
    next('/')
  }
}
