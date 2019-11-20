<template>
  <pageLayout>
    <div class="d-flex">
      <form class="col-md-4" @submit.prevent="save">
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
            <option value="0" disabled v-if="!updatedPage"> -- Выбрать категорию -- </option>
            <option 
              v-for="cat in getCategories" 
              :key="cat.id" 
              :value="cat.id"
            >{{ cat.name }}</option>
          </select>
        </div>
        <button type="submit" class="btn btn-success">{{ updatedPage ? 'Обновить' : 'Сохранить' }}</button>
      </form>
    </div>
  </pageLayout>
</template>

<script>
import validator from 'validator'
import { mapGetters } from 'vuex'
import { FETCH_CATEGORIES_TREE, ADD_CATEGORY, UPDATE_CATEGORY } from 'actions/categories'
import { LOADING } from 'actions/common'
import threeToFlat from 'utils/threeToFlat'

export default {
  data () {
    return {
      updatedPage: false,
      selectedCategory: 0,
      categoryName: '',
      errors: []
    }
  },
  computed: {
    ...mapGetters(['categories']),
    category () {
      return this.$store.getters.category(+this.$route.params.categoryId)
    },

    getCategories () {
      return threeToFlat(this.categories)
    }
  },
  methods: {
    save () {
      this.errors = []
      if (!this.updatedPage) {
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
  async created () {
    const categoryId = this.$route.params.categoryId
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_CATEGORIES_TREE)

    if (categoryId) {
      this.updatedPage = true
      if (this.category) {
        this.selectedCategory = this.category.parentId
        this.categoryName = this.category.name
      }
    }
    await this.$store.dispatch(LOADING, false)
    console.log(this)
  }
}
</script>