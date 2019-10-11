<template>
  <div>
    <div class="list-group list-group-flush">
      <router-link
        v-for="m in roleMenu" 
        :key="m.path" 
        :to="m.path"
        class="list-group-item list-group-item-action"
        :class="{ 'active' : activeMenu(m) }"
      >
        {{ m.name }}
      </router-link>
      <span class="list-group-item list-group-item-action"></span>
      <router-link to="/profile" class="list-group-item list-group-item-action">Профиль</router-link>
      <a
        href="#"
        @click.prevent="logout"
        class="list-group-item list-group-item-action">
        <i class="fas fa-unlock"></i>
        Выйти
      </a>
    </div>
  </div>
</template>

<script>
import { AUTH_LOGOUT } from 'actions/auth'
export default {
  props: ['role'],
  data () {
    return {
      menu: [
        { name: 'Категории', path: '/categories', role: 'admin' },
        { name: 'Свойства', path: '/properties', role: 'admin' },
        { name: 'Заявки для передачи вещи', path: '/application-transfer', role: 'admin' },
        { name: 'Вещи', path: '/things', role: 'admin' },
        { name: 'Заявки для получении вещи', path: '/application-recieve', role: 'admin' },
        { name: 'Пользователи', path: '/users', role: 'admin' },
        { name: 'User', path: '/user', role: 'user' },
        { name: 'Supplier', path: '/supplier', role: 'supplier' },
        { name: 'Storekeeper', path: '/storekeeper', role: 'storekeeper' },
      ]
    }
  },
  computed: {
    roleMenu () {
      return this.menu.filter(m => m.role === this.role)
    }
  },
  methods: {
    activeMenu (m) {
      return this.$route.path.search(m.path) !== -1
    },
    logout () {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.push('/signin')
      })
    }
  }
}
</script>