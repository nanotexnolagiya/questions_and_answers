
import { isAuth, isRole } from './middleware/rbac'
import multiguard from 'vue-router-multiguard'
import Status from '@/pages/admin/statuses/List'
import StatusUpdate from '@/pages/admin/statuses/Update'

export default [
  {
    path: '/statuses',
    component: Status,
    beforeEnter: multiguard([isAuth, isRole('admin')])
  },
  {
    path: '/statuses/:id',
    component: StatusUpdate,
    beforeEnter: multiguard([isAuth, isRole('admin')])
  }
]
