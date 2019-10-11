const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY,
  DB: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres'
    // omitNull: true
  },
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  FACEBOOK_APP_VERSION: process.env.FACEBOOK_APP_VERSION || 'v1.1'
}
