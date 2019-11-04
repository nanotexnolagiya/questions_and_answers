<template>
  <component :is="componentByRole('Home')"></component>
</template>

<script>
import adminHome from '@/pages/admin/Home'
import userHome from '@/pages/user/Home'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  components: {
    adminHome,
    userHome
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