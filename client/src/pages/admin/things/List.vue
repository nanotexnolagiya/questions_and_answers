<template>
  <pageLayout>
    <div class="content-actions mb-3 row">
      <div class="col-sm-3">
        <router-link to="/things/create" class="btn btn-success" tag="button">Добавить вещь</router-link>
      </div>

      <div class="col-sm-9">
        <div class="d-flex justify-content-end">
        <div class="form-group">
          <select class="form-control" v-model="filterStatus">
            <option :value="-1"> ----- Все ----- </option>
            <option 
              v-for="status in statuses" 
              :key="status.id" 
              :value="status.id"
            >{{ status.name }}</option>
          </select>
        </div>
        </div>
      </div>
    </div>
    <div class="table-responsive" v-if="things && things.length > 0">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Категория</th>
            <th scope="col">Свойства</th>
            <th scope="col">Статус</th>
            <th scope="col">Действии</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="thing in things" :key="thing.id">
            <td v-text="thing.Category ? thing.Category.name : 'Неизвестно'"></td>
            <td v-html="thing.Properties.length > 0 ? propertiesToString(thing.Properties) : 'Пусто'"></td>
            <td v-text="thing.Status.name"></td>
            <td>
              <div class="d-flex">
                <router-link :to="`/things/${thing.id}`">
                  <i class="fas fa-edit text-warning" ></i>
                </router-link>
                <a :href="`#/${thing.id}`" @click.prevent="remove(thing.id)">
                  <i class="fas fa-trash text-danger"></i>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="alert alert-info" v-else>Вещи не найдены</div>
  </pageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_THINGS, REMOVE_THING } from 'actions/things'
import { FETCH_STATUSES } from 'actions/statuses'
import { LOADING } from 'actions/common'
export default {
  data () {
    return {
      filterStatus: -1
    }
  },
  computed: {
    ...mapGetters(['things', 'statuses'])
  },
  watch: {
    async filterStatus (newValue) {
      let statusId = newValue
      if (statusId === -1) statusId = null
      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(FETCH_THINGS, { statusId })
      await this.$store.dispatch(LOADING, false)
    }
  },
  methods: {
    async remove (id) {
      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(REMOVE_THING, id)
      await this.$store.dispatch(FETCH_THINGS)
      await this.$store.dispatch(LOADING, false)
    },
    propertiesToString (properties) {
      const result = []
      properties.map(property => {
        if (property.ThingPropertyValues) {
          if (property.type === 'color') {
            result.push(`${property.name}: <span class="color" style="background-color: ${property.ThingPropertyValues.value}"></span>`)
          } else {
            result.push(`${property.name}: ${property.ThingPropertyValues.value}`)
          }
        } else {
          result.push(`${property.name}: Пусто`)
        }
      })

      return result.join(', ')
    }
  },
  async created () {
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_THINGS)
    await this.$store.dispatch(FETCH_STATUSES)
    await this.$store.dispatch(LOADING, false)
  }
}
</script>