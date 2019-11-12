const express = require('express')
const router = express.Router()
const { Users, Roles } = require('../models')
const config = require('../config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const axios = require('axios')

/**
 * @api {post} /signup/
 * @apiGroup Auth
 * @apiPermission user
 * @apiParam {String} name  User name
 * @apiParam {String} phone  User phone number
 * @apiParam {String} password  User password
 * @apiParam {String} access_token  User phone confirm access token
 * @apiParam {String} email  User email
 * @apiSuccess {Boolean} ok Response type
 * @apiSuccess {String} token  Access token
 * @apiSuccess {String} role  User role
 */
const signup = async (req, res, next) => {
  const { name, phone, password, code } = req.body
  try {
    const resToken = await axios.get(`https://graph.accountkit.com/${config.FACEBOOK_APP_VERSION}/access_token`, {
      params: {
        grant_type: 'authorization_code',
        code,
        access_token: ['AA', config.FACEBOOK_APP_ID, config.FACEBOOK_APP_SECRET].join('|')
      }
    })
    const resBody = await axios.get(
      `https://graph.accountkit.com/${config.FACEBOOK_APP_VERSION}/me`, {
        params: {
          access_token: resToken.data.access_token
        }
      }
    )

    const confirmPhone = resBody.data.phone.national_number

    if (phone === confirmPhone) { // phone === confirmPhone 
      const hash = await bcrypt.hash(password, 10)

      let hasUser = await Users.findOne({
        where: {
          phone
        }
      })
      if (!hasUser) {
        const currRole = await Roles.findOne({
          where: {
            code: 'user'
          }
        })
        
        const user = await Users.create({
          name,
          phone,
          password: hash,
          roleId: currRole.id
        })

        const token = await jwt.sign(
          {
            role: currRole.code,
            userId: user.id
          },
          config.SECRET_KEY,
          { expiresIn: '1d' }
        )

        res.status(201).json({
          ok: true,
          token,
          role: currRole.code
        })
      } else {
        throw new ResponseException('Пользоватеь уже существует', 400)
      }
    } else {
      throw new ResponseException('Телефон не подтверждено', 400)
    }
  } catch (error) {
    next(error)
  }
}

/**
 * @api {post} /signin/
 * @apiGroup Auth
 * @apiPermission user
 * @apiParam {String} phone  User phone number
 * @apiParam {String} password  User password
 * @apiSuccess {Boolean} ok Response type
 * @apiSuccess {String} token  Access token
 * @apiSuccess {String} role  User role
 */
const signin = async (req, res, next) => {
  /**
   * Request body variables
   * @var {string} phone - User phone
   * @var {string} password - User password
   * @var {string} role - user | supplier
   */
  const { phone, password } = req.body
  try {
    const user = await Users.findOne({
      where: {
        phone
      },
      include: [
        {
          model: Roles
        }
      ]
    })

    if (user) {
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        const token = await jwt.sign(
          {
            role: user.Role.code,
            userId: user.id
          },
          config.SECRET_KEY,
          { expiresIn: '1d' }
        )

        res.status(200).json({
          ok: true,
          token,
          role: user.Role.code
        })
      } else {
        throw new ResponseException('Ошибка в авторизации', 400)
      }
    } else {
      throw new ResponseException('Ошибка в авторизации', 400)
    }
  } catch (error) {
    next(error)
  }
}

const checkUser = async (req, res, next) => {
  const { phone } = req.body
  try {
    const user = await Users.findOne({
      where: {
        phone: phone
      }
    });

    if (user) {
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  } catch (error) {
    next(error);
  }
}

router.post('/signin', signin)
router.post('/signup', signup)
router.post('/check', checkUser)

module.exports = router
