<template>
  <pageLayout>
    <div class="content-actions mb-3 row">
      <div class="col-sm-3">
        <router-link to="/app-receives/create" class="btn btn-success" tag="button">Добавить заявку</router-link>
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
    <div class="table-responsive" v-if="appReceives && appReceives.length > 0">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Категория</th>
            <th scope="col">Свойства</th>
            <th scope="col">Пользователь</th>
            <th scope="col">Доставшик</th>
            <th scope="col">Вещь</th>
            <th scope="col">Статус</th>
            <th scope="col">Действии</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appReceive in appReceives" :key="appReceive.id">
            <td v-text="appReceive.Category ? appReceive.Category.name : 'Неизвестно'"></td>
            <td v-html="appReceive.Properties.length > 0 ? propertiesToString(appReceive.Properties) : 'Пусто'"></td>
            <td v-text="appReceive.ApplicationReceiveUser ? appReceive.ApplicationReceiveUser.name : 'Неизвестно'"></td>
            <td v-text="appReceive.ApplicationReceiveSupplier ? appReceive.ApplicationReceiveSupplier.name : 'Неизвестно'"></td>
            <td v-text="appReceive.Thing ? appReceive.Thing.id : 'Не найдено'"></td>
            <td v-text="appReceive.Status.name"></td>
            <td>
              <div class="d-flex">
                <router-link :to="`/app-receives/${appReceive.id}`">
                  <i class="fas fa-edit text-warning" ></i>
                </router-link>
                <a :href="`#/${appReceive.id}`" @click.prevent="remove(appReceive.id)">
                  <i class="fas fa-trash text-danger"></i>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="alert alert-info" v-else>Заявки не найдены</div>
  </pageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_APP_RECEIVES, REMOVE_APP_RECEIVE } from 'actions/appReceive'
import { FETCH_STATUSES } from 'actions/statuses'
import { LOADING } from 'actions/common'
export default {
  data () {
    return {
      filterStatus: -1
    }
  },
  computed: {
    ...mapGetters(['appReceives', 'statuses'])
  },
  watch: {
    async filterStatus (newValue) {
      let statusId = newValue
      if (statusId === -1) statusId = null
      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(FETCH_APP_RECEIVES, { statusId })
      await this.$store.dispatch(LOADING, false)
    }
  },
  methods: {
    async remove (id) {
      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(REMOVE_APP_RECEIVE, id)
      await this.$store.dispatch(FETCH_APP_RECEIVES)
      await this.$store.dispatch(LOADING, false)
    },
    propertiesToString (properties) {
      const result = []
      properties.map(property => {
        if (property.ApplicationReceivePropertyValues) {
          if (property.type === 'color') {
            result.push(`${property.name}: <span class="color" style="background-color: ${property.ApplicationReceivePropertyValues.value}"></span>`)
          } else {
            result.push(`${property.name}: ${property.ApplicationReceivePropertyValues.value}`)
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
    await this.$store.dispatch(FETCH_APP_RECEIVES)
    await this.$store.dispatch(FETCH_STATUSES)
    await this.$store.dispatch(LOADING, false)
  }
}
</script>