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

export default {
  computed: {
    ...mapGetters(['categories']),
  },
  created () {
    this.$store.dispatch(FETCH_CATEGORIES_TREE)
  }
}
</script>