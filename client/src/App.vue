<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { USER_REQUEST } from 'actions/user'

export default {
  name: 'app',
  components: {},
  computed: {
    ...mapGetters(['loading'])
  },
  created () {
    if (this.$store.getters.isAuthenticated) {
      this.$store.dispatch(USER_REQUEST)
    }
  }
}
</script>

<style lang="scss">

body {
  overflow-x: hidden;
}

#sidebar-wrapper {
  min-height: 100vh;
  margin-left: -15rem;
  transition: margin 0.25s ease-out;

  .sidebar-heading {
    padding: 0.875rem 1.25rem;
    font-size: 1.2rem;
  }

  .list-group {
    width: 15rem;
  }
}

#page-content-wrapper {
  min-width: 100vw;
}

#wrapper.toggled #sidebar-wrapper {
  margin-left: 0;
}

.full-height {
  height: 100vh;
}

.list-group-item.active {
  background-color: #28a745;
  border-color: #28a745;

  .badge-success {
    background-color: #ffffff;
    color: #28a745;
  }
}

.center-form {
  width: 350px;
  padding: 20px;
  border: 1px solid #28a745;
}

.content-center-form {
  width: 400px;
}

table img {
  width: 100px;
}

table tr th i,
table tr td i {
  margin-right: 5px;
}

@media (min-width: 768px) {
  #sidebar-wrapper {
    margin-left: 0;
  }

  #page-content-wrapper {
    min-width: 0;
    width: 100%;
  }

  #wrapper.toggled #sidebar-wrapper {
    margin-left: -15rem;
  }
}
</style>
