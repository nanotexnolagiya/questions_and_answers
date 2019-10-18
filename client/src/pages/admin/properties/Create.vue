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
          <input type="text" class="form-control" placeholder="Свойства" v-model="name">
        </div>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Тип" v-model="type">
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
import { mapGetters } from 'vuex'
import { FETCH_CATEGORIES } from 'actions/categories'
import { ADD_PROPERTY } from 'actions/properties'
import { LOADING } from 'actions/common'

export default {
  data () {
    return {
      updatedPage: false,
      selectedCategories: [],
      name: '',
      type: '',
      errors: []
    }
  },
  computed: {
    ...mapGetters(['categories'])
  },
  methods: {
    async save () {
      this.errors = []
      await this.$store.dispatch(LOADING, true)
      if (this.name.length < 3) this.errors.push('Введите название свойтсва')
      if (this.type.length < 3) this.errors.push('Введите тип свойтсва')

      if (this.errors.length === 0) {
        await this.$store.dispatch(ADD_PROPERTY, {
          name: this.name,
          categoryIds: this.selectedCategories,
          type: this.type
        })
        this.$router.push('/properties')
      }
      await this.$store.dispatch(LOADING, false)
    }
  },
  async created () {
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_CATEGORIES)
    await this.$store.dispatch(LOADING, false)
  }
}
</script>