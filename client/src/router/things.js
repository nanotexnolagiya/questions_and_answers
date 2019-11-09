import { isAuth } from './middleware/rbac'
import Things from '@/pages/things/List'
import ThingCreate from '@/pages/things/Create'
import multiguard from 'vue-router-multiguard'

export default [
  {
    path: '/things',
    component: Things,
    beforeEnter: multiguard([isAuth])
  },
  {
    path: '/things/create',
    component: ThingCreate,
    beforeEnter: multiguard([isAuth])
  },
  {
    path: '/things/:id',
    component: ThingCreate,
    beforeEnter: multiguard([isAuth])
  }
]
