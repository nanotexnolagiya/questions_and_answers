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
const signup = async (req, res) => {
  const { name, phone, password, access_token } = req.body
  try {
    // const resBody = await axios.get(
    //   `https://graph.accountkit.com/${config.FACEBOOK_APP_VERSION}/me?access_token=${access_token}`
    // )

    // const confirmPhone = resBody.data.phone.number

    if (true) { // phone === confirmPhone 
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
          role_id: currRole.id
        })

        console.log(user);

        const token = await jwt.sign(
          {
            role: currRole.code,
            user_id: user.id
          },
          config.SECRET_KEY,
          { expiresIn: '1d' }
        )

        res.status(200).json({
          ok: true,
          token,
          role: currRole.code
        })
      } else {
        throw new Error('User existing!')
      }
    } else {
      throw new Error('Phone not confirm')
    }
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message
    })
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
const signin = async (req, res) => {
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
            user_id: user.id
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
        throw new Error('password failed')
      }
    } else {
      throw new Error('user not found')
    }
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message
    })
  }
}

router.post('/signin', signin)
router.post('/signup', signup)

module.exports = router
