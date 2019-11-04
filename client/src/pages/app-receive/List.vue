<template>
  <component :is="componentByRole('AppReceive')"></component>
</template>

<script>
import adminAppReceive from '@/pages/admin/app-receive/List'
import userAppReceive from '@/pages/user/app-receive/List'
import supplierAppReceive from '@/pages/supplier/app-receive/List'
import storekeeperAppReceive from '@/pages/storekeeper/app-receive/List'
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