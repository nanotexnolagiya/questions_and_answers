import { isAuth } from './middleware/rbac'
import AppReceives from '@/pages/app-receive/List'
import AppReceiveCreate from '@/pages/app-receive/Create'
import multiguard from 'vue-router-multiguard'

export default [
  {
    path: '/app-receives',
    component: AppReceives,
    beforeEnter: multiguard([isAuth])
  },
  {
    path: '/app-receives/create',
    component: AppReceiveCreate,
    beforeEnter: multiguard([isAuth])
  },
  {
    path: '/app-receives/:id',
    component: AppReceiveCreate,
    beforeEnter: multiguard([isAuth])
  }
]
