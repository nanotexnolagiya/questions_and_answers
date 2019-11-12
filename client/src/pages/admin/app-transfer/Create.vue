<template>
  <pageLayout>
    <div class="d-flex">
      <form class="col-md-4" enctype="multipart/form-data" @submit.prevent="save">
        <p class="alert alert-danger" v-if="errors && errors.length > 0">
          <ul>
            <li v-for="err in errors" :key="err">{{ err }}</li>
          </ul>
        </p>
        <div class="form-group">
          <textarea class="form-control" rows="7" placeholder="Техт заявки" v-model="text"></textarea>
        </div>
        <div class="form-group">
          <select class="form-control" v-model="selectedStatus">
            <option value="-1" disabled v-if="!updatedPage"> -- Выбрать Статус -- </option>
            <option 
              v-for="status in statuses" 
              :key="status.id" 
              :value="status.id"
            >{{ status.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <div class="custom-file">
            <input type="file" accept="image/*" ref="uploads" @change="upload" class="custom-file-input" id="customFile" multiple="multiple">
            <label class="custom-file-label" for="customFile">Выбрать файл</label>
          </div>
        </div>
        <div class="form-group">
          <div class="upload-results" v-if="images.length > 0">
            <img v-for="image in images" :key="image" :src="image" alt="">
          </div>
          <div class="uploads-results" v-else-if="appTransfer && appTransfer.Uploads.length > 0">
            <img v-for="upload in appTransfer.Uploads" :src="`${process.env.HOSTNAME}${upload.path}`" :key="upload.id" alt="">
          </div>
        </div>
        <button type="submit" class="btn btn-success">{{ updatedPage ? 'Обновить' : 'Сохранить' }}</button>
      </form>
    </div>
  </pageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { ADD_UPLOADS, ADD_APP_TRANSFER, FETCH_APP_TRANSFER_BY_ID, UPDATE_APP_TRANSFER } from 'actions/appTransfer'
import { FETCH_STATUSES } from 'actions/statuses'
import { LOADING } from 'actions/common'
export default {
  data () {
    return {
      text: '',
      selectedStatus: -1,
      accessFileTypes: ['image/png', 'image/jpeg'],
      images: [],
      imagesFormData: null,
      errors: [],
      updatePage: false
    }
  },
  computed: {
    ...mapGetters(['uploads', 'appTransfer', 'statuses'])
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
        upload_ids: this.uploads.map(upload => upload.id),
        statusId: this.selectedStatus === -1 ? null : this.selectedStatus
      }

      if (this.updatePage) {
        await this.$store.dispatch(UPDATE_APP_TRANSFER, {id: this.$route.params.id, ...appTransfer})
      } else {
        await this.$store.dispatch(ADD_APP_TRANSFER, appTransfer)
      }
      await this.$store.dispatch(LOADING, false)
      this.$router.push('/app-transfers')
    }
  },
  async created () {
    const id = this.$route.params.id

    await this.$store.dispatch(FETCH_STATUSES)

    if (id) {
      await this.$store.dispatch(LOADING, true)
      await this.$store.dispatch(FETCH_APP_TRANSFER_BY_ID, id)
      if (this.appTransfer) {
        this.updatePage = true
        this.text = this.appTransfer.text
        this.selectedStatus = this.appTransfer.Status.id
      }
      await this.$store.dispatch(LOADING, false)
    }
  }
}
</script>