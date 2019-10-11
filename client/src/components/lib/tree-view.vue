<template>
    <li class="tree-view-item">
      <div class="tree-view-item-block">
        <i class="fas" 
          :class="{
            'fa-chevron-right': open && !loading,
            'fa-chevron-down': !open && !loading,
            'fa-spinner spinner-animation': loading
          }"
          @click="open = !open" 
          v-if="data.children && data.children.length > 0"
          ></i>
        <input type="text" :value="data.name" v-if="change" @blur="changeHandle"/>
        <span v-else @click.prevent="change = !change">
          {{ data.name }}
        </span>
        <router-link :to="`/categories/${data.id}`">
          <i class="fas fa-edit text-warning" ></i>
        </router-link>
        <a :href="`#/${data.id}`" @click.prevent="remove(data.id)">
          <i class="fas fa-trash text-danger"></i>
        </a>
      </div>

      <ul v-if="data.children && data.children.length > 0 && open" class="tree-view">
        <tree-view v-for="child in data.children" :data="child" :key="child.id" />
      </ul>
    </li>
</template>

<script>
import { REMOVE_CATEGORY, FETCH_CATEGORIES_TREE } from 'actions/categories'
export default {
  props: ['data'],
  data () {
    return {
      open: true,
      change: false,
      loading: false
    }
  },
  methods: {
    changeHandle (e) {
      console.log(e.target.value)
      this.loading = true
      this.change = false
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    remove (id) {
      this.$store.dispatch(REMOVE_CATEGORY, id).then(() => {
        this.$store.dispatch(FETCH_CATEGORIES_TREE)
      })
    }
  }
}
</script>

<style lang="scss">
.spinner-animation {
  animation: spinner 2s linear infinite;
}
.tree-view {
  position: relative;
  padding-inline-start: 26px;
  list-style: none;

  &:before {
    content: "";
    position: absolute;
    width: 1px;
    height: 100%;
    background-color: #000;
  }

  &-item {
    position: relative;

    &-block {
      padding: 5px 20px;

      &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 15px;
        width: 15px;
        height: 1px;
        background-color: #000;
      }

      > span {
        margin-right: 20px;
      }
    }
  }
}

@keyframes spinner { 
  100% { 
    transform:rotate(360deg); 
  } 
}
</style>