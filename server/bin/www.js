const http = require('http');
const app = require('../app');
const bcrypt = require('bcryptjs');
const config = require('../config');
const roles = require('../enums/roles');
const { sequelize, Users } = require('../models');
const port = config.PORT;
app.set('port', port);

const server = http.createServer(app);

const databaseReload = false;

sequelize
  .sync({ force: databaseReload })
  .then(() => {
    server.listen(port)
    server.on('error', onError)
    server.on('listening', onListening)
  })
  .catch(err => console.log(err));

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = async () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
  try {
    if (databaseReload) {

      const hash = await bcrypt.hash('pageup16', 10);
      await Users.create({
        username: 'Admin',
        email: 'admin@info.com',
        phone: '+998123123123',
        password: hash,
        role: roles.ADMINISTRATOR
      });
    }
  } catch (error) {
    console.log('Error seed');
    console.log(error.message);
  }
}
