<template>
  <div id="app">
    <oops :show="error" />
    <loading :load="loading" v-if="showLoading" />
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { USER_REQUEST } from 'actions/user'
import loading from 'components/lib/loading'
import oops from 'components/lib/oops'

export default {
  name: 'app',
  data () {
    return {
      showLoading: false
    }
  },
  components: {
    loading,
    oops
  },
  computed: {
    ...mapGetters(['loading', 'error'])
  },
  watch: {
    loading (newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.showLoading = newVal
        }, 500)
      } else {
        this.showLoading = newVal
      }
    }
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

a {
  color: #28a745;
}

.action-nav .nav-link {
  margin-right: 10px;
  border: 1px solid #28a645;
  border-radius: 0.25rem;
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

.color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 10px;
}

[type="color"] {
  display:none;
}

.color-icon {
  width: 32px;
  height: 32px;
  display: inline-block;
  border-radius: 16px;
  background-image: url('./assets/color.png');
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

.alert ul {
  padding-left: 17px;
  margin-bottom: 0;

  li {
    font-size: 12px;
    font-weight: 700;
    font-family: sans-serif;
  }
}

.upload-results {
  display: flex;
  flex-wrap: wrap;

  & > img {
    flex: 0 0 20%;
    max-width: 20%;
  }
}

.progress {
  height: 12px;
  border-radius: 0;
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
