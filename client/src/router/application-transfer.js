import { isAuth } from './middleware/rbac'
import AppTransfer from '@/pages/app-transfer/List'
import AppTransferCreate from '@/pages/app-transfer/Create'
import multiguard from 'vue-router-multiguard'

export default [
  {
    path: '/app-transfers',
    component: AppTransfer,
    beforeEnter: multiguard([isAuth]),
    meta: {
      title: 'Заявки для передачи вещи'
    }
  },
  {
    path: '/app-transfers/create',
    component: AppTransferCreate,
    beforeEnter: multiguard([isAuth])
  },
  {
    path: '/app-transfers/:id',
    component: AppTransferCreate,
    beforeEnter: multiguard([isAuth])
  }
]
