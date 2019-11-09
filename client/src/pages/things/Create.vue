<template>
  <component :is="componentByRole('Things')"></component>
</template>

<script>
import adminThings from '@/pages/admin/things/Create'
import storekeeperThings from '@/pages/storekeeper/things/Create'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  components: {
    adminThings,
    storekeeperThings
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