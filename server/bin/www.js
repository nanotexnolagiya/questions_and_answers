const http = require('http')
const app = require('../app')
const bcrypt = require('bcryptjs')
const config = require('../config')
const { sequelize, Users, Roles, Statuses } = require('../models')
const port = config.PORT
app.set('port', port)

const server = http.createServer(app)

const databaseReload = false

sequelize
  .sync({ force: databaseReload })
  .then(() => {
    server.listen(port)
    server.on('error', onError)
    server.on('listening', onListening)
  })
  .catch(err => console.log(err))

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = async () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  console.log(`Listening on ${bind}`)
  try {
    if (databaseReload) {
      await Statuses.bulkCreate([
        { code: 'cancel' },
        { code: 'expects' },
        { code: 'delivery' },
        { code: 'way' },
        { code: 'accepted' },
        { code: 'store' },
        { code: 'booking' },
        { code: 'exists' },
        { code: 'cart' }
      ])

      await Roles.bulkCreate([
        { code: 'admin' },
        { code: 'user' },
        { code: 'supplier' },
        { code: 'storekeeper' }
      ])

      const hash = await bcrypt.hash('pageup16', 10)
      await Users.create({
        role_id: 1,
        name: 'Admin',
        phone: '+998123456789',
        password: hash
      })
    }
  } catch (error) {
    console.log('Error seed')
    console.log(error.message)
  }
}
