<template>
  
  <div class="d-flex" id="wrapper" :class="{'toggled': !sidebar}">

    <!-- Sidebar -->
    <div class="bg-light border-right" id="sidebar-wrapper">
      <div class="sidebar-heading">Open Hands</div>
      <navigation v-if="role && role.length > 0" :role="role" />
    </div>
    <!-- /#sidebar-wrapper -->

    <!-- Page Content -->
    <div id="page-content-wrapper">

      <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <button class="btn mr-auto" @click.prevent="sidebar = !sidebar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <span class="text-dark" v-if="user">Привет: {{ user.name }}</span>
      </nav>

      <div class="container-fluid p-3">
        <slot />
      </div>
    </div>
    <!-- /#page-content-wrapper -->

  </div>
</template>

<script>
import navigation from 'components/lib/navigation'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      sidebar: true
    }
  },
  components: {
    navigation
  },
  computed: {
    ...mapGetters(['role', 'user'])
  }
}
</script>