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
        { code: 'cancelled', name: 'Отменено' },
        { code: 'await', name: 'Ожидает' },
        { code: 'confirmed', name: 'Подтверждено' },
        { code: 'in_the_way', name: 'В пути' },
        { code: 'delivered', name: 'Доставлено' },
        { code: 'found_match', name: 'Найдено совпадение' }
      ])

      await Roles.bulkCreate([
        { code: 'admin', name: 'Администратор' },
        { code: 'user', name: 'Пользователь' },
        { code: 'supplier', name: 'Доставщик' },
        { code: 'storekeeper', name: 'Кладовщик' }
      ])

      const hash = await bcrypt.hash('pageup16', 10)
      await Users.create({
        roleId: 1,
        name: 'Admin',
        phone: '+998123123123',
        password: hash
      })
    }
  } catch (error) {
    console.log('Error seed')
    console.log(error.message)
  }
}
