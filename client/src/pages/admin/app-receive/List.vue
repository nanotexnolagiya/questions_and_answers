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
            <th scope="col">#</th>
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
            <td v-text="appReceive.id"></td>
            <td v-text="appReceive.Category ? appReceive.Category.name : 'Неизвестно'"></td>
            <td v-html="appReceive.Properties.length > 0 ? propertiesToString(appReceive.Properties) : 'Пусто'"></td>
            <td v-text="appReceive.ApplicationReceiveUser ? appReceive.ApplicationReceiveUser.name : 'Неизвестно'"></td>
            <td v-text="appReceive.ApplicationReceiveSupplier ? appReceive.ApplicationReceiveSupplier.name : 'Неизвестно'"></td>
            <td v-text="appReceive.Thing ? appReceive.Thing.id : 'Не найдено'"></td>
            <td v-text="appReceive.Status.name"></td>
            <td>
              <div class="d-flex">
                <a :href="`#/${appReceive.id}`" v-if="appReceive.Status.code === 'found_match'" @click.prevent="confirm(appReceive)">
                  <i class="fas fa-check text-success"></i>
                </a>
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
    <div class="row" v-if="appReceives && appReceives.length > 0">
      <div class="col-md-2">
        <label for="page_limit" class="d-flex form-inline">
          Показать по: &nbsp;
          <select class="form-control" id="page_limit" v-model="limit">
            <option 
              v-for="pageLimite in pageLimites" 
              :key="pageLimite" 
              :value="pageLimite"
              v-text="pageLimite"
            ></option>
          </select>
        </label>
      </div>
      <div class="col-md-10" v-if="pages > 1">
        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-end">
            <li class="page-item" :class="{'disabled': page === 1}">
              <a class="page-link" href="#" @click.prevent="setPage(page - 1)">
                <i class="fa fa-chevron-left"></i>
              </a>
            </li>
            <li class="page-item" :class="{'active': p === page}" v-for="p in pages" :key="p">
              <a class="page-link" href="#" v-text="p" @click.prevent="setPage(p)"></a>
            </li>
            <li class="page-item" :class="{'disabled': page === pages}">
              <a class="page-link" href="#" @click.prevent="setPage(page + 1)">
                <i class="fa fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </pageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_APP_RECEIVES, REMOVE_APP_RECEIVE, UPDATE_APP_RECEIVE } from 'actions/appReceive'
import { UPDATE_THING } from 'actions/things'
import { FETCH_STATUSES } from 'actions/statuses'
import { LOADING } from 'actions/common'
export default {
  data () {
    return {
      filterStatus: -1,
      limit: 10,
      pageLimites: [1, 10, 25, 50],
      page: 1,
      pages: 5
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
      this.page = 1
      await this.$store.dispatch(FETCH_APP_RECEIVES, { statusId, limit: this.limit, page: this.page })
      await this.$store.dispatch(LOADING, false)
    },
    async page (newValue) {
      await this.$store.dispatch(LOADING, true)
      const data = await this.$store.dispatch(FETCH_APP_RECEIVES, {
        limit: this.limit,
        page: newValue
      })
      this.pages = data.pageCount
      await this.$store.dispatch(LOADING, false)
    },
    async limit (newValue) {
      await this.$store.dispatch(LOADING, true)
      this.page = 1
      const data = await this.$store.dispatch(FETCH_APP_RECEIVES, {
        limit: newValue,
        page: this.page
      })
      this.pages = data.pageCount
      await this.$store.dispatch(LOADING, false)
    }
  },
  methods: {
    setPage (page) {
      this.page = page
    },
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
    },
    async confirm (appReceive) {
      if (confirm('Вы точно этого хотите')) {
        await this.$store.dispatch(LOADING, true)
        const confirmedStatus = this.$store.getters.statusByCode('confirmed')
        await this.$store.dispatch(UPDATE_APP_RECEIVE, { id: appReceive.id, statusId: confirmedStatus.id })
        await this.$store.dispatch(UPDATE_THING, { id: appReceive.thingId, statusId: confirmedStatus.id })
        await this.$store.dispatch(FETCH_APP_RECEIVES, { statusId: this.filterStatus === -1 ? null : this.filterStatus })
        await this.$store.dispatch(LOADING, false)
      }
    }
  },
  async created () {
    await this.$store.dispatch(LOADING, true)
    const data = await this.$store.dispatch(FETCH_APP_RECEIVES, {
      limit: this.limit,
      page: this.page
    })
    this.pages = data.pageCount
    await this.$store.dispatch(FETCH_STATUSES)
    await this.$store.dispatch(LOADING, false)
  }
}
</script>