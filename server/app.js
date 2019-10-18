const express = require('express')
const { json, urlencoded } = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const routes = require('./routes')

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(morgan('dev'))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/v1', routes.api)

app.use('/api/v1', (req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    ok: false,
    message: error.message
  })
})

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/index.html'));
// })

module.exports = app
