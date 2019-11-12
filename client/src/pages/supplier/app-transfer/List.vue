<template>
  <pageLayout>
    <div class="content-actions mb-3 row">
      <div class="col-md-3">
        <router-link to="/app-transfers/create" class="btn btn-success" tag="button">Добавить заявку</router-link>
      </div>

      <div class="col-md-9">
        <div class="d-flex justify-content-end">
          <ul class="nav action-nav">
            <li class="nav-item dropdown" v-if="role === 'supplier'">
              <a href="#" class="nav-link dropdown-toggle" @click.prevent="dropdown">Доставка</a>
              <div class="dropdown-menu">
                <a 
                  class="dropdown-item" 
                  href="#" 
                  v-for="supplierNav in supplierNavs"
                  :key="supplierNav.status" 
                  @click.prevent="supplierActions($event, supplierNav.status)"
                  v-text="supplierNav.name"></a>
              </div>
            </li>
            <li class="nav-item" v-for="nav in navs" :key="nav">
              <a class="nav-link" href="#" @click.prevent="getByStatus(nav.status)" v-text="nav.name"></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="table-responsive" v-if="appTransfers && appTransfers.length > 0">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Картина</th>
            <th scope="col">Подробно</th>
            <th scope="col">{{ supplierStatus ? 'Пользователь' : 'Доставшик' }}</th>
            <th scope="col">Статус</th>
            <th scope="col">Действии</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appTransfer in appTransfers" :key="appTransfer.id">
            <td v-text="appTransfer.id"></td>
            <td>
              <img v-if="appTransfer.Uploads && appTransfer.Uploads.length > 0" :src="`${process.env.HOSTNAME}${appTransfer.Uploads[0].path}`" alt="">
            </td>
            <td v-text="appTransfer.text"></td>
            <td 
              v-if="!supplierStatus"
              v-text="appTransfer.ApplicationTransferSupplier ? appTransfer.ApplicationTransferSupplier.name : 'Неизвестно'"></td>
            <td
              v-else
              v-text="appTransfer.ApplicationTransferUser ? appTransfer.ApplicationTransferUser.name : 'Неизвестно'"
              ></td>
            <td v-text="appTransfer.Status.name"></td>
            <td>
              <div class="d-flex">
                <a 
                  :href="`#/${appTransfer.id}`" 
                  @click.prevent="confirm(appTransfer)" 
                  v-if="supplierStatus === 'confirmed' || supplierStatus === 'in_the_way'">
                  <i class="fas fa-check text-success"></i>
                </a>
                <a 
                  :href="`#/${appTransfer.id}`" 
                  @click.prevent="remove(appTransfer.id)" 
                  v-if="!supplierStatus">
                  <i class="fas fa-trash text-danger"></i>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="alert alert-info" v-else>Заявки не найдены</div>
    <div class="row" v-if="appTransfers && appTransfers.length > 0">
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
import {
  FETCH_ACCOUNT_APP_TRANSFERS,
  REMOVE_ACCOUNT_APP_TRANSFER,
  FETCH_SUPPLIER_APP_TRANSFERS_CONFIRMED,
  SET_SEPPLIER_APP_TRANSFER_IN_THE_WAY,
  SET_SEPPLIER_APP_TRANSFER_DELIVERED,
  FETCH_SUPPLIER_APP_TRANSFERS,
  FETCH_SUPPLIER_APP_TRANSFERS_DELIVERED
} from 'actions/appTransfer'
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
      ],
      supplierStatus: null
    }
  },
  computed: {
    ...mapGetters(['appTransfers', 'statuses', 'role']),
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
      e.target.nextElementSibling.style.display = elementDisplay === 'none' ? 'flex' : 'none'
    },
    async fetch (params, action) {
      const status = await this.$store.getters.statusByCode('cancelled')
      if (!action) action = FETCH_ACCOUNT_APP_TRANSFERS
      const data = await this.$store.dispatch(action, {
        statusId: !this.supplierStatus ? `not:${status.id}` : null,
        page: this.page,
        limit: this.limit,
        ...params
      })
      this.pages = data.pageCount
    },
    async remove (id) {
      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(REMOVE_ACCOUNT_APP_TRANSFER, id)
      await this.fetch()
      await this.$store.dispatch(LOADING, false)
    },
    async getByStatus (statusCode) {
      this.page = 1
      this.supplierStatus = null
      await this.$store.dispatch(LOADING, true)
      const status = await this.$store.getters.statusByCode(statusCode)
      await this.fetch({
        statusId: status.id
      })
      await this.$store.dispatch(LOADING, false)
    },
    async supplierActions (e, code) {
      this.page = 1
      this.supplierStatus = code
      switch (code) {
        case 'confirmed':
          await this.fetch({}, FETCH_SUPPLIER_APP_TRANSFERS_CONFIRMED)
          break
        case 'in_the_way':
          await this.fetch({}, FETCH_SUPPLIER_APP_TRANSFERS)
          break
        case 'delivered':
          await this.fetch({}, FETCH_SUPPLIER_APP_TRANSFERS_DELIVERED)
          break
        default:
          break
      }
      e.target.parentElement.style.display = 'none'
    },
    async confirm (appTransfer) {
      this.page = 1
      switch (this.supplierStatus) {
        case 'confirmed':
          await this.$store.dispatch(SET_SEPPLIER_APP_TRANSFER_IN_THE_WAY, appTransfer.id)
          await this.fetch({}, FETCH_SUPPLIER_APP_TRANSFERS_CONFIRMED)
          break
        case 'in_the_way':
          await this.$store.dispatch(SET_SEPPLIER_APP_TRANSFER_DELIVERED, appTransfer.id)
          await this.fetch({}, FETCH_SUPPLIER_APP_TRANSFERS)
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