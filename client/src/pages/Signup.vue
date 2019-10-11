<template>
  <div class="d-flex justify-content-center align-items-center flex-column full-height">
    <form class="center-form" @submit.prevent="signup">
      <h3 class="text-center mb-3">Sign Up</h3>
      <p v-if="errors.length" class="mb-3 alert alert-danger">
        <b>Пожалуйста исправьте указанные ошибки:</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Full Name" v-model="name">
      </div>
      <div class="form-group">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="phone">+998</span>
          </div>
          <input type="text" class="form-control" placeholder="Phone Number" aria-label="Phone Number" aria-describedby="phone" v-model="phone">
        </div>
      </div>
      <div class="form-group">
        <input type="password" class="form-control" placeholder="Password" v-model="password">
      </div>
      <div class="form-group">
        <input type="password" class="form-control" placeholder="Confirm Password" v-model="cpassword">
      </div>
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="privacy">
        <label class="form-check-label" for="exampleCheck1">Privacy Policy</label>
      </div>
      <div class="form-group text-right">

        <router-link to="/signin">
          Sign In
          <span class="fas fa-long-arrow-alt-right"></span>
        </router-link>
      </div>
      <button type="submit" class="btn btn-success" :disabled="!privacy">
        Sign Up
      </button>
    </form>
  </div>
</template>

<script>
import validator from 'validator'
import { AUTH_SIGNUP } from 'actions/auth'

export default {
  data () {
    return {
      name: '',
      phone: '',
      cpassword: '',
      password: '',
      privacy: false,
      errors: []
    }
  },
  methods: {
    signup () {
      const { name, password, cpassword } = this
      let phone = this.phone
      phone = phone.replace(/\s/g, '')
      phone = '+998' + phone
      this.errors = []
      if (!validator.isLength(name, { min: 3, max: 255 })) {
        this.errors.push('Имя должен быть больше 3 и менше 255')
      } else if (!validator.isNumeric(phone) && phone.length !== 9) {
        this.errors.push('Не правилный номер телефона')
      } else if (!validator.isLength(password, {min: 6, max: 255})) {
        this.errors.push('Парол должен быть больше 6 и менше 255')
      } else if (password !== cpassword) {
        this.errors.push('Пароли не совпадает')
      }
      if (this.errors.length === 0) {
        this.$store.dispatch(AUTH_SIGNUP, { phone, name, password }).then(() => {
          location.href = '/'
        })
      }
    }
  }
}
</script>