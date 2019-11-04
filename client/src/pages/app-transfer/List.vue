<template>
  <component :is="componentByRole('AppTransfer')"></component>
</template>

<script>
import adminAppTransfer from '@/pages/admin/app-transfer/List'
import userAppTransfer from '@/pages/user/app-transfer/List'
import supplierAppTransfer from '@/pages/supplier/app-transfer/List'
import storekeeperAppTransfer from '@/pages/storekeeper/app-transfer/List'
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