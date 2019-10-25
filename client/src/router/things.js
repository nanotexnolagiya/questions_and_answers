import { isAuth, isRole } from './middleware/rbac'
import Things from '@/pages/admin/things/List'
import ThingsCreate from '@/pages/admin/things/Create'
import multiguard from 'vue-router-multiguard'

export default [
  {
    path: '/things',
    component: Things,
    beforeEnter: multiguard([isAuth, isRole('admin')])
  },
  {
    path: '/things/create',
    component: ThingsCreate,
    beforeEnter: multiguard([isAuth, isRole('admin')])
  },
  {
    path: '/things/:id',
    component: ThingsCreate,
    beforeEnter: multiguard([isAuth, isRole('admin')])
  }
]
