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
          <input type="text" class="form-control" placeholder="Свойства" v-model="name">
        </div>
        <div class="form-group">
          <select class="form-control" v-model="type">
            <option value="" disabled> -- Выбрать тип -- </option>
            <option 
              v-for="t in types" 
              :key="t.value" 
              :value="t.value"
            >{{ t.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <select class="form-control" v-model="selectedCategories" multiple>
            <option value="0" disabled v-if="!updatedPage"> -- Выбрать категорию -- </option>
            <option 
              v-for="cat in categories" 
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
import { FETCH_CATEGORIES } from 'actions/categories'
import { ADD_PROPERTY, UPDATE_PROPERTY, FETCH_PROPERTIES } from 'actions/properties'
import { LOADING } from 'actions/common'

export default {
  data () {
    return {
      types: [
        { name: 'Текст', value: 'text' },
        { name: 'Число', value: 'number' },
        { name: 'Большой текст', value: 'textarea' },
        { name: 'Цветь', value: 'color' }
      ],
      updatedPage: false,
      selectedCategories: [],
      name: '',
      type: '',
      errors: []
    }
  },
  computed: {
    categories () {
      return this.notChildCategory(this.$store.getters.categories)
    },
    property () {
      return this.$store.getters.property(+this.$route.params.id)
    }
  },
  methods: {
    notChildCategory (categories) {
      const results = []
      for (const categorySearched of categories) {
        let checkCategory = false
        for (const category of categories) {
          if (category.parentId === categorySearched.id) {
            checkCategory = true
          }
        }

        if (!checkCategory) results.push(categorySearched)
      }
      return results
    },
    async save () {
      this.errors = []
      await this.$store.dispatch(LOADING, true)
      if (this.name.length < 3) this.errors.push('Введите название свойтсва')
      if (this.type.length < 3) this.errors.push('Введите тип свойтсва')

      if (this.errors.length === 0) {
        const property = {
          name: this.name,
          categoryIds: this.selectedCategories,
          type: this.type
        }
        if (this.updatedPage) {
          await this.$store.dispatch(UPDATE_PROPERTY, {id: this.$route.params.id, ...property})
        } else {
          await this.$store.dispatch(ADD_PROPERTY, property)
        }
        this.$router.push('/properties')
      }
      await this.$store.dispatch(LOADING, false)
    }
  },
  async created () {
    const id = this.$route.params.id

    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_CATEGORIES)
    if (id) {
      await this.$store.dispatch(FETCH_PROPERTIES)
      this.updatedPage = true
      if (this.property) {
        this.selectedCategories = this.property.Categories.map(category => category.id)
        this.name = this.property.name
        this.type = this.property.type
      }
    }
    await this.$store.dispatch(LOADING, false)
  }
}
</script>