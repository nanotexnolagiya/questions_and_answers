const path = require('path')
const multer = require('multer')
const mkdirp = require('mkdirp')
const slugify = require('./slugify')

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const date = new Date()
      const dir = `public/uploads/${date.getFullYear()}/${date.getMonth()}`
      mkdirp(dir, err => cb(err, dir))
    },
    filename: async (req, file, cb) => {
      const fileName = await slugify(file.originalname.replace(/\.[^/.]+$/, ''))
      const fileFullName = `${fileName}-${Date.now().toString() +
        path.extname(file.originalname)}`

      cb(null, fileFullName)
    }
  }),
  limits: {
    fileSize: 3 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)

    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.gif') {
      const error = new ResponseException('Не допустимое расширение', 400)
      error.code = 'EXTENTION'
      return cb(error)
    }

    cb(null, true)
  }
})
