<template>
  <pageLayout>
    <div class="content-actions mb-3">
      <router-link to="/properties/create" class="btn btn-success" tag="button">Добавить Свойтсва</router-link>
    </div>
    <div class="table-responsive" v-if="properties && properties.length > 0">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Название</th>
            <th scope="col">Категория</th>
            <th scope="col">Действии</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="property in properties" :key="property.id">
            <td v-text="property.name"></td>
            <td>
              <div v-if="property.Categories" v-text="property.Categories.map(cat => cat.name).join(', ')"></div>
            </td>
            <td>
              <div class="d-flex">
                <router-link :to="`/properties/${property.id}`">
                  <i class="fas fa-edit text-warning" ></i>
                </router-link>
                <a :href="`#/${property.id}`" @click.prevent="remove(property.id)">
                  <i class="fas fa-trash text-danger"></i>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="alert alert-info" v-else>Свойстви не найдены</div>
  </pageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_PROPERTIES, REMOVE_PROPERTY } from '../../../store/actions/properties'
import { LOADING } from 'actions/common'
export default {
  computed: {
    ...mapGetters(['properties'])
  },
  methods: {
    async remove (id) {
      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(REMOVE_PROPERTY, id)
      await this.$store.dispatch(FETCH_PROPERTIES)
      await this.$store.dispatch(LOADING, false)
    }
  },
  async created () {
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_PROPERTIES)
    await this.$store.dispatch(LOADING, false)
  }
}
</script>