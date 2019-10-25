<template>
  <div class="oops" v-if="show" @click="hide">
    <div class="oops-content">
      <img src="../../assets/oops.png" alt="">
      <h1>Упссс... <br/>Что-то пошло не так</h1>
    </div>
  </div>
</template>

<script>
import { ERROR } from 'actions/common'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hide () {
      this.show = false
      this.$store.dispatch(ERROR, false)
    }
  }
}
</script>

<style lang="scss">
.oops{
  position: absolute;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(#000, 0.7);
  z-index: 10;
  
  &-content {
    width: 450px;
    padding: 10px 20px;
    border-radius: 15px;
    background-color: #ffffff;
    text-align: center;

    img {
      max-width: 100%;
    }
  }
}
</style>