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
        // Admin
        { name: 'Категории', path: '/categories', roles: ['admin'] },
        { name: 'Свойства', path: '/properties', roles: ['admin'] },
        { name: 'Заявки для передачи вещи', path: '/app-transfers', roles: ['admin', 'user', 'supplier', 'storekeeper'] },
        { name: 'Вещи', path: '/things', roles: ['admin', 'storekeeper'] },
        { name: 'Заявки для получении вещи', path: '/app-receives', roles: ['admin', 'user', 'supplier', 'storekeeper'] },
        { name: 'Пользователи', path: '/users', roles: ['admin'] },
        { name: 'Медиа', path: '/media', roles: ['admin'] },
        { name: 'Роли', path: '/roles', roles: ['admin'] },
        { name: 'Статусы', path: '/statuses', roles: ['admin'] }
      ]
    }
  },
  computed: {
    roleMenu () {
      return this.menu.filter(m => m.roles.includes(this.role))
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