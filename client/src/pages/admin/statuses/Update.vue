<template>
  <pageLayout>
    <div class="d-flex">
      <form class="col-sm-4" @submit.prevent="save">
        <p class="alert alert-danger" v-if="errors && errors.length > 0">
          <ul>
            <li v-for="err in errors" :key="err">{{ err }}</li>
          </ul>
        </p>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Статус" v-model="name">
        </div>
        <button type="submit" class="btn btn-success">Обновить</button>
      </form>
    </div>
  </pageLayout>
</template>

<script>
import { FETCH_STATUSES, UPDATE_STATUS } from '../../../store/actions/statuses'
import { LOADING } from '../../../store/actions/common'

export default {
  data () {
    return {
      name: '',
      errors: []
    }
  },
  computed: {
    status () {
      return this.$store.getters.status(+this.$route.params.id)
    }
  },
  methods: {
    async save () {
      this.errors = []

      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(UPDATE_STATUS, { id: this.$route.params.id, name: this.name })
      await this.$store.dispatch(LOADING, false)
      this.$router.push('/statuses')
    }
  },
  async created () {
    const id = this.$route.params.id
    await this.$store.dispatch(LOADING, true)

    if (id) {
      await this.$store.dispatch(FETCH_STATUSES)
      if (this.status) {
        this.name = this.status.name
      }
    }
    await this.$store.dispatch(LOADING, false)
  }
}
</script>