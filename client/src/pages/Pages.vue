<template>
  <pageLayout>
    <adminHome v-if="role === 'admin'" />
    <userHome v-if="role === 'user'" />
  </pageLayout>
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
  }
}
</script>