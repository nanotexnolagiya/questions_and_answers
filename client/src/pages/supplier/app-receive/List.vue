<template>
  <pageLayout>
    <div class="content-actions mb-3 row">
      <div class="col-sm-3">
        <router-link to="/app-receives/create" class="btn btn-success" tag="button">Добавить заявку</router-link>
      </div>

      <div class="col-sm-9">
        <div class="d-flex justify-content-end">
          <ul class="nav action-nav">
            <li class="nav-item dropdown" v-if="role === 'supplier'">
              <a href="#" class="nav-link dropdown-toggle" @click.prevent="dropdown">Доставка</a>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#">Нужно доставить</a>
                <a class="dropdown-item" href="#">Доставляемые</a>
                <a class="dropdown-item" href="#">Доставленные</a>
              </div>
            </li>
            <li class="nav-item" v-for="nav in navs" :key="nav">
              <a class="nav-link" href="#" @click.prevent="getByStatus(nav.status)" v-text="nav.name"></a>
            </li>
          </ul>
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
import { FETCH_ACCOUNT_APP_RECEIVES, REMOVE_ACCOUNT_APP_RECEIVE } from 'actions/appReceive'
import { FETCH_STATUSES } from 'actions/statuses'
import { LOADING } from 'actions/common'
export default {
  data () {
    return {
      limit: 10,
      pageLimites: [1, 10, 25, 50],
      page: 1,
      pages: 0,
      navs: [
        { name: 'Ожидает', status: 'await' },
        { name: 'Подтверждено', status: 'confirmed' },
        { name: 'В пути', status: 'in_the_way' }
      ],
      supplierNavs: [
        { name: 'Нужно доставить', status: 'confirmed' },
        { name: 'Доставляемые', status: 'in_the_way' },
        { name: 'Доставленные', status: 'delivered' }
      ]
    }
  },
  computed: {
    ...mapGetters(['appReceives', 'statuses', 'role'])
  },
  watch: {
    async page (newValue) {
      await this.$store.dispatch(LOADING, true)
      await this.fetch({
        page: newValue
      })
      await this.$store.dispatch(LOADING, false)
    },
    async limit (newValue) {
      await this.$store.dispatch(LOADING, true)
      this.page = 1
      await this.fetch({
        limit: newValue
      })
      await this.$store.dispatch(LOADING, false)
    }
  },
  methods: {
    setPage (page) {
      this.page = page
    },
    dropdown (e) {
      let elementDisplay = e.target.nextElementSibling.style.display.length > 0 ? e.target.nextElementSibling.style.display : 'none'
      e.target.nextElementSibling.style.display = elementDisplay === 'none' ? 'block' : 'none'
    },
    async fetch (params) {
      const status = await this.$store.getters.statusByCode('cancelled')
      const data = await this.$store.dispatch(FETCH_ACCOUNT_APP_RECEIVES, {
        statusId: `not:${status.id}`,
        page: this.page,
        limit: this.limit,
        ...params
      })
      this.pages = data.pageCount
    },
    async remove (id) {
      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(REMOVE_ACCOUNT_APP_RECEIVE, id)
      this.page = 1
      this.fetch()
      await this.$store.dispatch(LOADING, false)
    },
    propertiesToString (properties) {
      const result = []
      properties.map(property => {
        if (property.ApplicationReceivePropertyValues) {
          if (property.type === 'color') {
            result.push(`
              ${property.name}: 
              <span 
                class="color" 
                style="background-color: ${property.ApplicationReceivePropertyValues.value}">
              </span>
            `)
          } else {
            result.push(`${property.name}: ${property.ApplicationReceivePropertyValues.value}`)
          }
        } else {
          result.push(`${property.name}: Пусто`)
        }
      })

      return result.join(', ')
    },
    async getByStatus (statusCode) {
      this.page = 1
      await this.$store.dispatch(LOADING, true)
      const status = await this.$store.getters.statusByCode(statusCode)
      await this.fetch({
        statusId: status.id
      })
      await this.$store.dispatch(LOADING, false)
    },
    async supplierActions (code) {
      switch (code) {
        case 'confirmed':
          // this.$store.dispatch();
          break
        default:
          break
      }
    }
  },
  async created () {
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_STATUSES)
    await this.fetch()
    await this.$store.dispatch(LOADING, false)
  }
}
</script>