<template>
  <component :is="componentByRole('AppReceive')"></component>
</template>

<script>
import adminAppReceive from '@/pages/admin/app-receive/Create'
import userAppReceive from '@/pages/user/app-receive/Create'
import supplierAppReceive from '@/pages/supplier/app-receive/Create'
import storekeeperAppReceive from '@/pages/storekeeper/app-receive/Create'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  components: {
    adminAppReceive,
    userAppReceive,
    supplierAppReceive,
    storekeeperAppReceive
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