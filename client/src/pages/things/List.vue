<template>
  <component :is="componentByRole('Things')"></component>
</template>

<script>
import adminThings from '@/pages/admin/things/List'
import storekeeperThings from '@/pages/storekeeper/things/List'
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