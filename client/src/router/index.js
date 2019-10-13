import Vue from 'vue'
import Router from 'vue-router'
import multiguard from 'vue-router-multiguard'
import Signup from '@/pages/Signup'
import Signin from '@/pages/Signin'
import Pages from '@/pages/Pages'
import Category from '@/pages/admin/categories/List'
import CreateCategory from '@/pages/admin/categories/Create'
import AppTransfer from '@/pages/admin/app-transfer/List'
import AppTransferCreate from '@/pages/admin/app-transfer/Create'
import { USER_REQUEST } from 'actions/user'
import { HAS_LOADED_ONCE } from 'actions/auth'
import store from '../store'

Vue.use(Router)

const isNotAuth = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const isAuth = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/signin')
}

const isRole = (role) => {
  return (to, from, next) => {
    if (store.getters.role === role) {
      next()
      return
    }
    next('/')
  }
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Pages,
      beforeEnter: multiguard([isAuth]),
      meta: {
        title: 'Главная'
      }
    },
    {
      path: '/categories',
      component: Category,
      beforeEnter: multiguard([isAuth, isRole('admin')]),
      meta: {
        title: 'Категории'
      }
    },
    {
      path: '/categories/create',
      component: CreateCategory,
      beforeEnter: multiguard([isAuth, isRole('admin')]),
      meta: {
        title: 'Добавить категорию'
      }
    },
    {
      path: '/categories/:categoryId',
      component: CreateCategory,
      beforeEnter: multiguard([isAuth, isRole('admin')]),
      meta: {
        title: 'Изменить категорию'
      }
    },
    {
      path: '/application-transfer',
      component: AppTransfer,
      beforeEnter: multiguard([isAuth, isRole('admin')]),
      meta: {
        title: 'Заявки для передачи вещи'
      }
    },
    {
      path: '/application-transfer/create',
      component: AppTransferCreate,
      beforeEnter: multiguard([isAuth, isRole('admin')])
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin,
      beforeEnter: isNotAuth
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      beforeEnter: isNotAuth
    }
  ]
})

router.beforeEach(async (to, from, next) => {
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
})

export default router
