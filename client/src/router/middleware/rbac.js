
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

export const isRole = (roles) => {
  return (to, from, next) => {
    if (roles.includes(store.getters.role)) {
      next()
      return
    }
    next('/404')
  }
}
