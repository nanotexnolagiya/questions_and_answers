
import { isAuth, isRole } from './middleware/rbac'
import multiguard from 'vue-router-multiguard'
import Category from '@/pages/admin/categories/List'
import CreateCategory from '@/pages/admin/categories/Create'

export default [
  {
    path: '/categories',
    component: Category,
    beforeEnter: multiguard([isAuth, isRole(['admin'])]),
    meta: {
      title: 'Категории'
    }
  },
  {
    path: '/categories/create',
    component: CreateCategory,
    beforeEnter: multiguard([isAuth, isRole(['admin'])]),
    meta: {
      title: 'Добавить категорию'
    }
  },
  {
    path: '/categories/:categoryId',
    component: CreateCategory,
    beforeEnter: multiguard([isAuth, isRole(['admin'])]),
    meta: {
      title: 'Изменить категорию'
    }
  }
]
