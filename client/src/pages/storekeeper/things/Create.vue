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
          <select class="form-control" @change="selectCategory" v-if="!updatedPage">
            <option value="0" selected disabled> -- Выбрать категорию -- </option>
            <option 
              v-for="cat in searchChildren(categories, 0)"
              :key="cat.id"
              :value="cat.id"
            >{{ cat.name }}</option>
          </select>
        </div>
        <div class="form-group" v-for="categoryTree in categoriesTree" :key="categoryTree.categoryId">
          <select class="form-control" @change="selectCategory">
            <option value="0" selected disabled> -- Выбрать категорию -- </option>
            <option 
              v-for="cat in categoryTree.children"
              :selected="updatedPage && cat.id === categoryTree.categoryId"
              :key="cat.id"
              :value="cat.id"
            >{{ cat.name }}</option>
          </select>
        </div>
        <div class="form-group" v-for="property in categoryProperties" :key="property.id">
          <label class="color-icon" :style="{'background': propertyValues[property.id]}" :for="`color_${property.id}`" v-if="property.type === 'color'">
            <input type="color" @change="colorUpdate" :id="`color_${property.id}`" v-model="propertyValues[property.id]" />
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
        <button type="submit" class="btn btn-success">{{ updatedPage ? 'Обновить' : 'Сохранить' }}</button>
      </form>
    </div>
  </pageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_CATEGORIES, FETCH_CATEGORY_PROPERTIES } from 'actions/categories'
import { ADD_THING, UPDATE_THING, FETCH_THING_BY_ID } from 'actions/things'
import { LOADING } from 'actions/common'

export default {
  data () {
    return {
      updatedPage: false,
      errors: [],
      categoriesTree: [],
      propertyValues: {},
      category: null
    }
  },
  computed: {
    ...mapGetters(['categories', 'categoryProperties', 'thing'])
  },
  methods: {
    async save () {
      await this.$store.dispatch(LOADING, true)
      const { category, propertyValues } = this
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
        const thing = {
          properties,
          category_id: category,
        }
        if (this.updatedPage) {
          await this.$store.dispatch(UPDATE_THING, { id: this.thing.id, ...thing })
        } else {
          await this.$store.dispatch(ADD_THING, thing)
        }
        this.$router.push('/things')
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

      if (category.parentId === 0 && !this.updatedPage) {
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
      if (this.updatedPage) {
        alert('Пока что изменение категории не работает')
        return false
      }
      const categoryId = +e.target.value
      const children = this.searchChildren(this.categories, categoryId)
      if (children && children.length > 0) {
        this.clearChildren(categoryId)
        this.categoriesTree.push({
          categoryId,
          children
        })
      } else {
        this.category = categoryId
        this.$store.dispatch(FETCH_CATEGORY_PROPERTIES, categoryId)
      }
    },
    setCategoriesTree (categoryId, currentCategory) {
      const children = this.searchChildren(this.categories, categoryId)
      if (children && children.length > 0) {
        this.categoriesTree.push({
          categoryId: currentCategory,
          children
        })
        const category = this.findById(categoryId)
        if (category) {
          this.setCategoriesTree(category.parentId, category.id)
        }
      }
    },
    colorUpdate (e) {
      const color = e.target.value
      e.target.parentElement.style.background = color
    }
  },
  async created () {
    const id = this.$route.params.id
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_CATEGORIES)

    if (id) {
      this.updatedPage = true
      await this.$store.dispatch(FETCH_THING_BY_ID, id)

      if (this.thing) {
        this.category = this.thing.Category.id
        await this.setCategoriesTree(this.thing.Category.parentId, this.category)
        await this.categoriesTree.reverse()
        for (const property of this.thing.Properties) {
          this.categoryProperties = property
          this.propertyValues[property.id] = property.ThingPropertyValues.value
        }
        await this.$store.dispatch(FETCH_CATEGORY_PROPERTIES, this.category)
      }
      // update
    }
    await this.$store.dispatch(LOADING, false)
  },
  destroyed () {
    this.$store.dispatch(FETCH_CATEGORY_PROPERTIES, 'clear')
  }
}
</script>