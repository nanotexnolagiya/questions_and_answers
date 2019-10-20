<template>
  <pageLayout>
    <div class="table-responsive" v-if="statuses">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Название</th>
            <th scope="col">Действии</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="status in statuses" :key="status.id">
            <td v-text="status.id"></td>
            <td v-text="status.name"></td>
            <td>
              <div class="d-flex">
                <router-link :to="`/statuses/${status.id}`">
                  <i class="fas fa-edit text-warning" ></i>
                </router-link>
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
import { FETCH_STATUSES } from '../../../store/actions/statuses'
import { LOADING } from '../../../store/actions/common'

export default {
  computed: {
    ...mapGetters(['statuses']),
  },
  methods: {
  },
  async created () {
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_STATUSES)
    await this.$store.dispatch(LOADING, false)
  }
}
</script>