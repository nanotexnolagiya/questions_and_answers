<template>
  <component :is="componentByRole('AppTransfer')"></component>
</template>

<script>
import adminAppTransfer from '@/pages/admin/app-transfer/Create'
import userAppTransfer from '@/pages/user/app-transfer/Create'
import supplierAppTransfer from '@/pages/supplier/app-transfer/Create'
import storekeeperAppTransfer from '@/pages/storekeeper/app-transfer/Create'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  components: {
    adminAppTransfer,
    userAppTransfer,
    supplierAppTransfer,
    storekeeperAppTransfer
  },
  computed: {
    ...mapGetters(['role'])
  },
  methods: {
    componentByRole (component) {
      return this.role + component
    }
  }
}
</script>