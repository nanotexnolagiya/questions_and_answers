import Vue from 'vue'
import Router from 'vue-router'
import Pages from '@/pages/Pages'
import checkAuth from './middleware/check-auth'
import categoriesRoutes from './categories'
import authRoutes from './auth'
import appTransferRoutes from './application-transfer'
import usersRoutes from './users'
import properties from './properties'
import statuses from './statuses'
import { isAuth } from './middleware/rbac'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Pages,
      beforeEnter: isAuth,
      meta: {
        title: 'Главная'
      }
    },
    ...authRoutes,
    ...categoriesRoutes,
    ...appTransferRoutes,
    ...usersRoutes,
    ...properties,
    ...statuses
  ]
})

router.beforeEach(checkAuth)

export default router
