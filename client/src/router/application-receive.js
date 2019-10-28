import { isAuth, isRole } from './middleware/rbac'
import AppReceives from '@/pages/admin/app-receive/List'
import AppReceiveCreate from '@/pages/admin/app-receive/Create'
import multiguard from 'vue-router-multiguard'

export default [
  {
    path: '/app-receives',
    component: AppReceives,
    beforeEnter: multiguard([isAuth, isRole('admin')])
  },
  {
    path: '/app-receives/create',
    component: AppReceiveCreate,
    beforeEnter: multiguard([isAuth, isRole('admin')])
  },
  {
    path: '/app-receives/:id',
    component: AppReceiveCreate,
    beforeEnter: multiguard([isAuth, isRole('admin')])
  }
]
