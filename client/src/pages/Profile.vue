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
          <input type="text" class="form-control" placeholder="Имя" v-model="name">
        </div>
        <div class="form-group">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="phone">+998</span>
            </div>
            <input type="number" class="form-control" placeholder="Телефон" aria-label="Телефон" aria-describedby="phone" v-model="phone">
          </div>
        </div>
        <div class="form-group">
          <input 
            :type="showPassword ? 'text' : 'password'" class="form-control" 
            placeholder="Текущий пароль" 
            v-model="password">
        </div>
        <div class="form-group">
          <input :type="showPassword ? 'text' : 'password'" class="form-control" placeholder="Новый пароль" v-model="newPassword">
        </div>
        <div class="form-group">
          <a href="#" class="btn btn-primary" @click.prevent="showPassword = !showPassword">{{ !showPassword ? 'Показать' : 'Скрыть' }} пароль</a>
          <a href="#" class="btn btn-info" @click.prevent="generatePassword">Создать пароль</a>
        </div>
        <button type="submit" class="btn btn-success">Обновить</button>
      </form>
    </div>
  </pageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { LOADING } from 'actions/common'
import { USER_REQUEST_UPDATE, USER_REQUEST } from 'actions/user'

export default {
  data () {
    return {
      name: '',
      phone: '',
      password: '',
      newPassword: null,
      errors: [],
      showPassword: false
    }
  },
  computed: {
    ...mapGetters(['profile'])
  },
  methods: {
    randomPassword (length) {
      const chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890'
      let result = ''
      for (let x = 0; x < length; x++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    },
    generatePassword () {
      this.showPassword = true
      this.password = this.randomPassword(12)
    },
    async save () {
      const { name, password, newPassword } = this
      let phone = this.phone
      phone = phone.replace(/\s/g, '')
      this.errors = []
      if (this.errors.length === 0) {
        phone = '+998' + phone
        await this.$store.dispatch(LOADING, true)
        await this.$store.dispatch(USER_REQUEST_UPDATE, {
          name,
          phone,
          password,
          newPassword
        })
        await this.$store.dispatch(USER_REQUEST)
        this.$router.push('/')
        await this.$store.dispatch(LOADING, false)
      }
    }
  },
  mounted () {
    if (this.profile) {
      this.name = this.profile.name
      this.phone = this.profile.phone.slice(4)
    }
  }
}
</script>