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
          <select class="form-control" v-model="selectedRole">
            <option value="0" disabled v-if="!updatedPage"> -- Выбрать -- </option>
            <option 
              v-for="r in roles" 
              :key="r.id" 
              :value="r.id"
            >{{ r.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <input 
            :type="showPassword ? 'text' : 'password'" class="form-control" 
            :placeholder="updatedPage ? 'Текущий пароль' : 'Пароль'" 
            v-model="password">
        </div>
        <div class="form-group">
          <input :type="showPassword ? 'text' : 'password'" class="form-control" placeholder="Подтвердить пароль" v-model="cpassword" v-if="!updatedPage">
          <input :type="showPassword ? 'text' : 'password'" class="form-control" placeholder="Новый пароль" v-model="newPassword" v-else>
        </div>
        <div class="form-group">
          <a href="#" class="btn btn-primary" @click.prevent="showPassword = !showPassword">{{ !showPassword ? 'Показать' : 'Скрыть' }} пароль</a>
          <a href="#" class="btn btn-info" @click.prevent="generatePassword">Создать пароль</a>
        </div>
        <button type="submit" class="btn btn-success">{{ updatedPage ? 'Обновить' : 'Сохранить' }}</button>
      </form>
    </div>
  </pageLayout>
</template>

<script>
import validator from 'validator'
import { mapGetters } from 'vuex'
import { FETCH_ROLES, ADD_USER, UPDATE_USER, FETCH_USERS } from '../../../store/actions/user'
import { LOADING } from 'actions/common'

export default {
  data () {
    return {
      name: '',
      phone: '',
      password: '',
      newPassword: null,
      selectedRole: null,
      cpassword: null,
      errors: [],
      updatedPage: false,
      showPassword: false
    }
  },
  computed: {
    ...mapGetters(['roles']),
    user () {
      return this.$store.getters.user(+this.$route.params.userId)
    }
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
    save () {
      const { name, password, cpassword, selectedRole, newPassword } = this
      let phone = this.phone
      phone = phone.replace(/\s/g, '')
      this.errors = []
      if (!validator.isLength(name, { min: 3, max: 255 })) {
        this.errors.push('Имя должен быть больше 3 и менше 255')
      } else if (phone.length !== 9) {
        this.errors.push('Не правилный номер телефона')
      } else if (!selectedRole) {
        this.errors.push('Выберите роль')
      } else if ((!validator.isLength(password, {min: 6, max: 255}) && !this.updatedPage) || newPassword) {
        this.errors.push('Пароль должен быть больше 6 и менше 255')
      } else if (password !== cpassword && !this.updatedPage) {
        this.errors.push('Пароли не совпадает')
      } else if ((newPassword && (!validator.isLength(newPassword, {min: 6, max: 255}) && this.updatedPage))) {
        this.errors.push('Новый пароль должен быть больше 6 и менше 255')
      }
      if (this.errors.length === 0) {
        phone = '+998' + phone
        if (!this.updatedPage) {
          this.$store.dispatch(ADD_USER, {
            name,
            phone,
            role: selectedRole,
            password
          }).then(() => {
            this.$router.push('/users')
          })
        } else {
          this.$store.dispatch(UPDATE_USER, {
            id: this.$route.params.userId,
            name,
            phone,
            role: selectedRole,
            password,
            newPassword
          }).then(() => {
            this.$router.push('/users')
          })
        }
      }
    }
  },
  async mounted () {
    const userId = this.$route.params.userId
    await this.$store.dispatch(LOADING, true)
    await this.$store.dispatch(FETCH_ROLES)
    if (userId) {
      this.updatedPage = true
      await this.$store.dispatch(FETCH_USERS)
      if (this.user) {
        this.name = this.user.name
        this.phone = this.user.phone.slice(4)
        this.selectedRole = this.user.Role.id
      }
    }
    await this.$store.dispatch(LOADING, false)
  }
}
</script>