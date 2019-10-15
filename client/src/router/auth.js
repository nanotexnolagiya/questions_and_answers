import { isNotAuth } from './middleware/rbac'
import Signup from '@/pages/Signup'
import Signin from '@/pages/Signin'

export default [
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
    beforeEnter: isNotAuth
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    beforeEnter: isNotAuth
  }
]
