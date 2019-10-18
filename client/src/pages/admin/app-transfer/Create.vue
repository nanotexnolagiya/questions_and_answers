<template>
  <pageLayout>
    <div class="d-flex">
      <form class="col-sm-4" enctype="multipart/form-data" @submit.prevent="save">
        <p class="alert alert-danger" v-if="errors && errors.length > 0">
          <ul>
            <li v-for="err in errors" :key="err">{{ err }}</li>
          </ul>
        </p>
        <div class="form-group">
          <textarea class="form-control" rows="7" placeholder="Техт заявки" v-model="text"></textarea>
        </div>
        <div class="form-group">
          <div class="custom-file">
            <input type="file" ref="uploads" @change="upload" class="custom-file-input" id="customFile" multiple="multiple">
            <label class="custom-file-label" for="customFile">Выбрать файл</label>
          </div>
        </div>
        <div class="form-group" v-if="images.length > 0">
          <div class="upload-results">
            <img v-for="image in images" :key="image" :src="image" alt="">
          </div>
        </div>
        <button type="submit" class="btn btn-success">Сохранить</button>
      </form>
    </div>
  </pageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { ADD_UPLOADS, ADD_APP_TRANSFER } from '../../../store/actions/appTransfer'
import { LOADING } from 'actions/common'
export default {
  data () {
    return {
      text: '',
      accessFileTypes: ['image/png', 'image/jpeg'],
      images: [],
      imagesFormData: null,
      errors: []
    }
  },
  computed: {
    ...mapGetters(['uploads'])
  },
  methods: {
    upload () {
      this.errors = []
      this.$store.dispatch(LOADING, true).then(() => {
        const files = this.$refs.uploads.files
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const fileSize = file.size / 1024 / 1024
          if (!this.accessFileTypes.includes(file.type)) {
            this.errors.push(`Тип файла не соответствуеть. Имя файла: ${file.name}`)
          } else if (fileSize > 3) {
            this.errors.push(`Файла больше 3Мб. Имя файла: ${file.name}. Размер: ${fileSize}`)
          } else {
            const reader = new FileReader()
            reader.onload = (e) => {
              this.images.push(e.target.result)
              formData.append('uploads[]', file)
              this.imagesFormData = formData
            }
            reader.readAsDataURL(file)
          }
        }
        this.$store.dispatch(LOADING, false)
      })
    },
    async save () {
      this.errors = []
      await this.$store.dispatch(LOADING, true)

      if (this.text.length < 20) {
        this.errors.push('Текст должен быть больше 20 символов')
        await this.$store.dispatch(LOADING, false)
        return
      }

      if (this.imagesFormData) {
        await this.$store.dispatch(ADD_UPLOADS, this.imagesFormData)
      }

      const appTransfer = {
        text: this.text,
        upload_ids: this.uploads.map(upload => upload.id)
      }

      await this.$store.dispatch(ADD_APP_TRANSFER, appTransfer)
      await this.$store.dispatch(LOADING, false)
      this.$router.push('/app-transfers')
    }
  }
}
</script>