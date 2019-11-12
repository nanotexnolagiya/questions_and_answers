<template>
  <div class="d-flex justify-content-center align-items-center flex-column full-height">
    <form class="center-form" @submit.prevent="signup">
      <h3 class="text-center mb-3">Регистрация</h3>
      <p v-if="errors.length" class="mb-3 alert alert-danger">
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Ф.И.О" v-model="name">
      </div>
      <div class="form-group">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="phone">+998</span>
          </div>
          <input type="text" class="form-control" placeholder="Телефон" aria-label="Phone Number" aria-describedby="phone" v-model="phone">
        </div>
      </div>
      <div class="form-group">
        <input type="password" class="form-control" placeholder="Пароль" v-model="password">
      </div>
      <div class="form-group">
        <input type="password" class="form-control" placeholder="Подтвердите пароль" v-model="cpassword">
      </div>
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="privacy">
        <label class="form-check-label" for="exampleCheck1">Политика конфиденциальности</label>
      </div>
      <div class="form-group text-right">

        <router-link to="/signin">
          Войти
          <span class="fas fa-long-arrow-alt-right"></span>
        </router-link>
      </div>
      <button type="submit" class="btn btn-success" :disabled="!privacy">
        Зарегистрироваться
      </button>
    </form>
  </div>
</template>

<script>
import validator from 'validator'
import { AUTH_SIGNUP } from 'actions/auth'
import { CHECK_USER } from 'actions/user'

export default {
  data () {
    return {
      name: '',
      phone: '',
      cpassword: null,
      password: '',
      countryCode: '+998',
      privacy: false,
      appId: '1945009795579340',
      fbAppEventsEnabled: false,
      redirect: `${window.location.host}/signup`,
      state: 'csrf_token',
      version: 'v1.0',
      loginType: 'PHONE',
      language: 'en_US',
      autoInit: true,
      errors: []
    }
  },
  mounted () {
    if (!window.AccountKit && this.autoInit) {
      this.initAccountKit()
    }
  },
  methods: {
    async signup () {
      const { name, password, cpassword } = this
      let phone = this.phone
      phone = phone.replace(/\s/g, '')
      phone = '+998' + phone
      this.errors = []
      if (!validator.isLength(name, { min: 3, max: 255 })) {
        this.errors.push('Имя должен быть больше 3 и менше 255')
      } else if (!validator.isNumeric(phone) && phone.length !== 13) {
        this.errors.push('Не правилный номер телефона')
      } else if (!validator.isLength(password, {min: 6, max: 255})) {
        this.errors.push('Парол должен быть больше 6 и менше 255')
      } else if (password !== cpassword) {
        this.errors.push('Пароли не совпадает')
      } else if (await this.$store.dispatch(CHECK_USER, phone)) {
        this.errors.push('Такой пользователь уже существуеть')
      }
      if (this.errors.length === 0) {
        this.verifyPhone(
          {
            countryCode: this.countryCode,
            phoneNumber: this.phone,
            display: 'modal'
          },
          this.signupCallback
        )
      }
    },
    signupCallback ({status, code, state}) {
      const { name, password, phone } = this

      if (status === 'PARTIALLY_AUTHENTICATED') {
        if (this.state === state) {
          this.$store.dispatch(AUTH_SIGNUP, { phone, name, password, code }).then(() => {
            this.$router.push('/')
          })
        }
        // Send code to server to exchange for access token
      } else if (status === 'NOT_AUTHENTICATED') {
        // handle authentication failure
      } else if (status === 'BAD_PARAMS') {
        // handle bad parameters
      }
    },
    initAccountKit () {
      const tag = document.createElement('script')
      tag.setAttribute(
        'src',
        `https://sdk.accountkit.com/ru_RU/sdk.js`
      )
      tag.setAttribute('id', 'account-kit')
      tag.setAttribute('type', 'text/javascript')
      tag.onload = () => {
        /* eslint-disable camelcase */
        window.AccountKit_OnInteractive = this.onLoad.bind(this)
        /* eslint-enable camelcase */
      }
      document.head.appendChild(tag)
    },
    /**
     * Implementation of AccountKit_OnInteractive
     * Initializes the facebook authentication kit calling the init function.
     * @see https://developers.facebook.com/docs/accountkit/webjs/reference
     */
    onLoad () {
      const { appId, fbAppEventsEnabled, redirect, state, version } = this
      window.AccountKit.init({
        appId,
        debug: true,
        // display,
        fbAppEventsEnabled,
        redirect,
        state,
        version
      })
    },
    /** console.log
     * @param {*} loginParams @see https://developers.facebook.com/docs/accountkit/webjs/reference
     */
    verifyPhone (loginParams, callback) {
      window.AccountKit.login('PHONE', loginParams, callback)
    }
  }
}
</script>