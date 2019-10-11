<template>
  <div class="d-flex justify-content-center align-items-center flex-column full-height">
    <form class="center-form" @submit.prevent="signin">
      <h3 class="text-center mb-3">Вход</h3>
      <p v-if="errors.length" class="mb-3 alert alert-danger">
        <b>Пожалуйста исправьте указанные ошибки:</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>
      <div class="form-group">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="phone">+998</span>
          </div>
          <input type="text" class="form-control" placeholder="Телефон" aria-label="Phone Number" aria-describedby="phone" v-model="phone">
        </div>
      </div>
      <div class="form-group">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="password">
              <i class="fas fa-lock"></i>
            </span>
          </div>
          <input type="password" class="form-control" id="group" placeholder="Пароль" aria-label="Password" aria-describedby="password" v-model="password">
        </div>
      </div>
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="remember">
        <label class="form-check-label" for="exampleCheck1">Remember Me</label>
      </div>
      <div class="form-group text-right">
        <router-link to="/signup">
          Регистрация
          <span class="fas fa-long-arrow-alt-right"></span>
        </router-link>
      </div>
      <button type="submit" class="btn btn-success">Войти</button>
    </form>  
  </div>
</template>

<script>
import validator from 'validator'
import { AUTH_SIGNIN } from 'actions/auth'

export default {
  data () {
    return {
      phone: '',
      password: '',
      remember: false,
      errors: []
    }
  },
  methods: {
    signin () {
      const { password } = this
      let phone = this.phone
      phone = phone.replace(/\s/g, '')
      this.errors = []
      if (phone.length !== 9) {
        this.errors.push('Не правилный номер телефона')
      } else if (!validator.isLength(password, {min: 6, max: 255})) {
        this.errors.push('Парол должен быть больше 6 и менше 25')
      }

      if (this.errors.length === 0) {
        phone = '+998' + phone
        this.$store.dispatch(AUTH_SIGNIN, { phone, password }).then(() => {
          location.href = '/'
        })
      }
    }
  }
}
</script>