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
          <select class="form-control" @change="selectCategory">
            <option value="0" selected disabled v-if="!updatedPage"> -- Выбрать категорию -- </option>
            <option 
              v-for="cat in searchChildren(categories, 0)"
              :key="cat.id"
              :value="cat.id"
            >{{ cat.name }}</option>
          </select>
        </div>
        <div class="form-group" v-for="(categoryTree, idx) in categoriesTree" :key="idx">
          <select class="form-control" @change="selectCategory">
            <option value="0" selected disabled> -- Выбрать категорию -- </option>
            <option 
              v-for="cat in categoryTree"
              :key="cat.id"
              :value="cat.id"
            >{{ cat.name }}</option>
          </select>
        </div>
        <div class="form-group" v-for="(property, idp) in categoryProperties" :key="idp">
          <label class="color-icon" :style="{'background': propertyValues[property.id]}" :for="`color_${property.id}`" v-if="property.type === 'color'">
            <input type="color" :id="`color_${property.id}`" v-model="propertyValues[property.id]" />
          </label>
          <textarea 
            class="form-control" 
            v-else-if="property.type === 'textarea'"
            v-model="propertyValues[property.id]"
            :placeholder="property.name" ></textarea>
          <input 
            :type="property.type" 
            v-else 
            class="form-control" 
            :placeholder="property.name" 
            v-model="propertyValues[property.id]"
            />
        </div>
        <div class="form-group">
          <select class="form-control" v-model="selectedStatus">
            <option value="-1" disabled v-if="!updatedPage"> -- Выбрать Статус -- </option>
            <option 
              v-for="status in statuses" 
              :key="status.id" 
              :value="status.id"
            >{{ status.name }}</option>
          </select>
        </div>
        <button type="submit" class="btn btn-success">{{ updatedPage ? 'Обновить' : 'Сохранить' }}</button>
      </form>
    </div>
  </pageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_CATEGORIES, FETCH_CATEGORY_PROPERTIES } from 'actions/categories'
import { ADD_APP_RECEIVE } from 'actions/appReceive'
import { FETCH_STATUSES } from 'actions/statuses'
import { LOADING } from 'actions/common'

export default {
  data () {
    return {
      updatedPage: false,
      errors: [],
      selectedStatus: -1,
      categoriesTree: [],
      propertyValues: {},
      category: null
    }
  },
  computed: {
    ...mapGetters(['categories', 'categoryProperties', 'statuses'])
  },
  methods: {
    async save () {
      await this.$store.dispatch(LOADING, true)
      const { category, propertyValues, selectedStatus } = this
      this.errors = []
      const propertyIds = Object.keys(propertyValues)
      const properties = []

      if (!category) this.errors.push('Выберите категорию')
      if (this.categoryProperties.length !== propertyIds.length) this.errors.push('Запольните свойства')

      if (this.errors.length === 0) {
        propertyIds.map(key => {
          properties.push({
            propertyId: key,
            value: propertyValues[key]
          })
        })
        await this.$store.dispatch(ADD_APP_RECEIVE, {
          properties,
          category_id: category,
          statusId: selectedStatus !== -1 ? selectedStatus : null
        })
        this.$router.push('/app-receives')
      }
      await this.$store.dispatch(LOADING, false)
    },
    propertyValuesChange (e, id) {
      const value = e.target.value
      this.propertyValues.push({
        propertyId: id,
        value
      })
    },
    searchChildren (categories, id) {
      const results = []
      for (const category of categories) {
        if (category.parentId === id) {
          results.push(category)
        }
      }
      return results
    },
    findById (id) {
      return this.categories.find(category => category.id === id)
    },
    clearChildren (categoryId) {
      const category = this.findById(categoryId)

      if (category.parentId === 0) {
        this.categoriesTree = []
        return
      }

      for (let i = this.categoriesTree.length - 1; i > 0; i--) {
        if (this.categoriesTree[i].parentId !== category.parentId) {
          this.categoriesTree.splice(i, 1)
        }
      }
    },
    selectCategory (e) {
      const categoryId = +e.target.value
      const children = this.searchChildren(this.categories, categoryId)
      if (children && children.length > 0) {
        this.clearChildren(categoryId)
        this.categoriesTree.push(children)
      } else {
        this.category = categoryId
        this.$store.dispatch(FETCH_CATEGORY_PROPERTIES, categoryId)
      }
    }
  },
  async created () {
    const id = this.$route.params.id
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_CATEGORIES)
    await this.$store.dispatch(FETCH_STATUSES)

    if (id) {
      this.updatedPage = true
      // update
    }
    await this.$store.dispatch(LOADING, false)
  },
  destroyed () {
    this.$store.dispatch(FETCH_CATEGORY_PROPERTIES, 'clear')
  }
}
</script>