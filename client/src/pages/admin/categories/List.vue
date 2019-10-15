<template>
  <pageLayout>
    <div class="content-actions mb-3">
      <router-link to="/categories/create" tag="button" class="btn btn-success">Добавить Категорию</router-link>
    </div>
    <ul v-if="categories && categories.length > 0" class="tree-view">
      <tree-view v-for="category in categories" :data="category" :key="category.id" />
    </ul>
  </pageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_CATEGORIES_TREE } from 'actions/categories'
import { LOADING } from 'actions/common'

export default {
  computed: {
    ...mapGetters(['categories']),
  },
  async created () {
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_CATEGORIES_TREE)
    await this.$store.dispatch(LOADING, false)
  }
}
</script>