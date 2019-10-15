<template>
  <pageLayout>
    <div class="content-actions mb-3">
      <router-link to="/users/create" tag="button" class="btn btn-success">Добавить Пользователя</router-link>
    </div>
    <div class="table-responsive" v-if="users">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Имя</th>
            <th scope="col">Телефон</th>
            <th scope="col">Роль</th>
            <th scope="col">Действии</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" v-if="u.id !== profile.id">
            <td>{{ u.name }}</td>
            <td>{{ u.phone }}</td>
            <td>{{ u.Role.code }}</td>
            <td>
              <div class="d-flex">
                <router-link :to="`/users/${u.id}`">
                  <i class="fas fa-edit text-warning" ></i>
                </router-link>
                <a :href="`#/${u.id}`" @click.prevent="remove(u.id)">
                  <i class="fas fa-trash text-danger"></i>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="alert alert-info" v-else>Пользователи не найдены</div>
  </pageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { REMOVE_USER, FETCH_USERS } from '../../../store/actions/user'
import { LOADING } from '../../../store/actions/common'

export default {
  computed: {
    ...mapGetters(['users', 'profile']),
  },
  methods: {
    async remove (id) {
      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(REMOVE_USER, id)
      await this.$store.dispatch(FETCH_USERS)
      await this.$store.dispatch(LOADING, false)
    }
  },
  async created () {
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_USERS)
    await this.$store.dispatch(LOADING, false)
  }
}
</script>