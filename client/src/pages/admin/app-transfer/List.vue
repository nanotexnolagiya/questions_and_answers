<template>
  <pageLayout>
    <div class="content-actions mb-3 row">
      <div class="col-sm-3">
        <router-link to="/app-transfers/create" class="btn btn-success" tag="button">Добавить заявку</router-link>
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
    <div class="table-responsive" v-if="appTransfers && appTransfers.length > 0">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Картина</th>
            <th scope="col">Подробно</th>
            <th scope="col">Пользователь</th>
            <th scope="col">Доставшик</th>
            <th scope="col">Статус</th>
            <th scope="col">Действии</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appTransfer in appTransfers" :key="appTransfer.id">
            <td>
              <img v-if="appTransfer.Uploads && appTransfer.Uploads.length > 0" :src="`http://localhost:3330${appTransfer.Uploads[0].path}`" alt="">
            </td>
            <td v-text="appTransfer.text"></td>
            <td v-text="appTransfer.ApplicationTransferUser ? appTransfer.ApplicationTransferUser.name : 'Неизвестно'"></td>
            <td v-text="appTransfer.ApplicationTransferSupplier ? appTransfer.ApplicationTransferSupplier.name : 'Неизвестно'"></td>
            <td v-text="appTransfer.Status.name"></td>
            <td>
              <div class="d-flex">
                <a :href="`#/${appTransfer.id}`" v-if="appTransfer.Status.code === 'expects'" @click.prevent="confirm(appTransfer)">
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
      filterStatus: -1
    }
  },
  computed: {
    ...mapGetters(['appTransfers', 'statuses'])
  },
  watch: {
    async filterStatus (newValue) {
      let statusId = newValue
      if (statusId === -1) statusId = null
      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(FETCH_APP_TRANSFERS, { statusId })
      await this.$store.dispatch(LOADING, false)
    }
  },
  methods: {
    async remove (id) {
      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(REMOVE_APP_TRANSFER, id)
      await this.$store.dispatch(FETCH_APP_TRANSFERS)
      await this.$store.dispatch(LOADING, false)
    },
    async confirm (appTransfer) {
      await this.$store.dispatch(LOADING, true)
      const confirmedStatus = this.$store.getters.statusByCode('confirmed')
      await this.$store.dispatch(UPDATE_APP_TRANSFER, { ...appTransfer, statusId: confirmedStatus.id })
      await this.$store.dispatch(FETCH_APP_TRANSFERS, { statusId: this.filterStatus === -1 ? null : this.filterStatus })
      await this.$store.dispatch(LOADING, false)
    }
  },
  async created () {
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_APP_TRANSFERS)
    await this.$store.dispatch(FETCH_STATUSES)
    await this.$store.dispatch(LOADING, false)
  }
}
</script>