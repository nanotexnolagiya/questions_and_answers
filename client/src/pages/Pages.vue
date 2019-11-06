<template>
  <component :is="componentByRole('Home')"></component>
</template>

<script>
import adminHome from '@/pages/admin/Home'
import userHome from '@/pages/user/Home'
import supplierHome from '@/pages/supplier/Home'
import storekeeperHome from '@/pages/storekeeper/Home'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  components: {
    adminHome,
    userHome,
    supplierHome,
    storekeeperHome
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