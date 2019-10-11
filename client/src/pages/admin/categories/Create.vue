<template>
  <pageLayout>
    <div class="d-flex">
      <form class="col-sm-4" @submit.prevent="save">
        <p class="alert alert-danger" v-if="errors && errors.length > 0">
          <ul>
            <li v-for="err in errors" :key="err">{{ err }}</li>
          </ul>
        </p>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Категория" v-model="categoryName">
        </div>
        <div class="form-group">
          <select class="form-control" v-model="selectedCategory">
            <option value="0" disabled v-if="!updateCategory"> -- Выбрать категорию -- </option>
            <option 
              v-for="cat in categories" 
              :key="cat.id" 
              :value="cat.id"
            >{{ cat.name }}</option>
          </select>
        </div>
        <button type="submit" class="btn btn-success">{{ updateCategory ? 'Обновить' : 'Сохранить' }}</button>
      </form>
    </div>
  </pageLayout>
</template>

<script>
import validator from 'validator'
import { mapGetters } from 'vuex'
import { FETCH_CATEGORIES, ADD_CATEGORY, UPDATE_CATEGORY } from 'actions/categories'

export default {
  data () {
    return {
      updateCategory: false,
      selectedCategory: 0,
      categoryName: '',
      errors: []
    }
  },
  computed: {
    ...mapGetters(['categories']),
    category () {
      return this.$store.getters.category(+this.$route.params.categoryId)
    }
  },
  methods: {
    save () {
      this.errors = []
      if (!this.updateCategory) {
        if (!validator.isLength(this.categoryName, { min: 3, max: 255 })) this.errors.push('Введите название категории')

        if (this.errors.length === 0) {
          this.$store.dispatch(ADD_CATEGORY, {
            name: this.categoryName,
            parent: this.selectedCategory
          }).then(() => {
            this.$router.push('/categories')
          })
        }
      } else {
        if (!validator.isLength(this.categoryName, { min: 3, max: 255 })) this.errors.push('Введите название категории')

        if (this.errors.length === 0) {
          this.$store.dispatch(UPDATE_CATEGORY, {
            id: this.$route.params.categoryId,
            name: this.categoryName,
            parent: this.selectedCategory
          }).then(() => {
            this.$router.push('/categories')
          })
        }
      }
    }
  },
  created () {
    const categoryId = this.$route.params.categoryId

    if (categoryId) {
      this.updateCategory = true
      this.$store.dispatch(FETCH_CATEGORIES).then(() => {
        if (this.category) {
          this.selectedCategory = this.category.parentId
          this.categoryName = this.category.name
        }
      })
    } else {
      this.$store.dispatch(FETCH_CATEGORIES)
    }
  }
}
</script>