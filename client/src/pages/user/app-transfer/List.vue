<template>
  <pageLayout>
    <div class="content-actions mb-3 row">
      <div class="col-sm-3">
        <router-link to="/app-transfers/create" class="btn btn-success" tag="button">Добавить заявку</router-link>
      </div>

      <div class="col-sm-9">
        <div class="d-flex justify-content-end">
          <ul class="nav action-nav">
            <li class="nav-item">
              <a class="nav-link" href="#">Ожидаюшие подтверждение</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Подтверждение</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Доставляемые</a>
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
            <th scope="col">Доставшик</th>
            <th scope="col">Статус</th>
            <th scope="col">Действии</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appTransfer in appTransfers" :key="appTransfer.id">
            <td v-text="appTransfer.id"></td>
            <td>
              <img v-if="appTransfer.Uploads && appTransfer.Uploads.length > 0" :src="`http://localhost:3330${appTransfer.Uploads[0].path}`" alt="">
            </td>
            <td v-text="appTransfer.text"></td>
            <td v-text="appTransfer.ApplicationTransferSupplier ? appTransfer.ApplicationTransferSupplier.name : 'Неизвестно'"></td>
            <td v-text="appTransfer.Status.name"></td>
            <td>
              <div class="d-flex">
                <a :href="`#/${appTransfer.id}`" v-if="appTransfer.Status.code === 'await'" @click.prevent="confirm(appTransfer)">
                  <i class="fas fa-check text-success"></i>
                </a>
                <router-link :to="`/app-transfers/${appTransfer.id}`">
                  <i class="fas fa-edit text-warning" ></i>
                </router-link>
                <a :href="`#/${appTransfer.id}`" @click.prevent="remove(appTransfer.id)">
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
import { FETCH_APP_TRANSFERS, REMOVE_APP_TRANSFER, UPDATE_APP_TRANSFER } from 'actions/appTransfer'
import { FETCH_STATUSES } from 'actions/statuses'
import { LOADING } from 'actions/common'
export default {
  data () {
    return {
      limit: 10,
      pageLimites: [1, 10, 25, 50],
      page: 1,
      pages: 5
    }
  },
  computed: {
    ...mapGetters(['appTransfers', 'statuses']),
  },
  watch: {
    async page (newValue) {
      await this.$store.dispatch(LOADING, true)
      const data = await this.$store.dispatch(FETCH_APP_TRANSFERS, {
        limit: this.limit,
        page: newValue
      })
      this.pages = data.pageCount
      await this.$store.dispatch(LOADING, false)
    },
    async limit (newValue) {
      await this.$store.dispatch(LOADING, true)
      this.page = 1
      const data = await this.$store.dispatch(FETCH_APP_TRANSFERS, {
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
      await this.$store.dispatch(REMOVE_APP_TRANSFER, id)
      await this.$store.dispatch(FETCH_APP_TRANSFERS)
      await this.$store.dispatch(LOADING, false)
    },
    async confirm (appTransfer) {
      if (confirm('Вы точно этого хотите')) {
        await this.$store.dispatch(LOADING, true)
        const confirmedStatus = this.$store.getters.statusByCode('confirmed')
        await this.$store.dispatch(UPDATE_APP_TRANSFER, { ...appTransfer, statusId: confirmedStatus.id })
        await this.$store.dispatch(FETCH_APP_TRANSFERS, { statusId: this.filterStatus === -1 ? null : this.filterStatus })
        await this.$store.dispatch(LOADING, false)
      }
    }
  },
  async created () {
    await this.$store.dispatch(LOADING, true)
    const data = await this.$store.dispatch(FETCH_APP_TRANSFERS, {
      limit: this.limit,
      page: this.page
    })
    this.pages = data.pageCount
    await this.$store.dispatch(FETCH_STATUSES)
    await this.$store.dispatch(LOADING, false)
  }
}
</script>