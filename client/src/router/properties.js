
import { isAuth, isRole } from './middleware/rbac'
import multiguard from 'vue-router-multiguard'
import Property from '@/pages/admin/properties/List'
import Create from '@/pages/admin/properties/Create'

export default [
  {
    path: '/properties',
    component: Property,
    beforeEnter: multiguard([isAuth, isRole('admin')])
  },
  {
    path: '/properties/create',
    component: Create,
    beforeEnter: multiguard([isAuth, isRole('admin')])
  },
  {
    path: '/properties/:propertyId',
    component: Create,
    beforeEnter: multiguard([isAuth, isRole('admin')])
  }
]
