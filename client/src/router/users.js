
import { isAuth, isRole } from './middleware/rbac'
import multiguard from 'vue-router-multiguard'
import Users from '@/pages/admin/users/List'
import CreateUser from '@/pages/admin/users/Create'

export default [
  {
    path: '/users',
    component: Users,
    beforeEnter: multiguard([isAuth, isRole(['admin'])]),
    meta: {
      title: 'Категории'
    }
  },
  {
    path: '/users/create',
    component: CreateUser,
    beforeEnter: multiguard([isAuth, isRole(['admin'])]),
    meta: {
      title: 'Добавить категорию'
    }
  },
  {
    path: '/users/:userId',
    component: CreateUser,
    beforeEnter: multiguard([isAuth, isRole(['admin'])]),
    meta: {
      title: 'Изменить категорию'
    }
  }
]
