import { isAuth, isRole } from './middleware/rbac'
import AppTransfer from '@/pages/admin/app-transfer/List'
import AppTransferCreate from '@/pages/admin/app-transfer/Create'
import multiguard from 'vue-router-multiguard'

export default [
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
  }
]
