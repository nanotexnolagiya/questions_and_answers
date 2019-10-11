const express = require('express')
const router = express.Router()
const { Users, Roles } = require('../models')

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
const me = async (req, res) => {
  try {
    if (req.userData) {
      const user = await Users.scope("userPublic").findOne({
        where: {
          id: req.userData.user_id
        },
        include: [
          { model: Roles.scope('rolePublic') }
        ]
      });

      if(!user) res.status(404).json({ok: false, message: 'user not found'});

      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    })
  }
}

router.post('/me', me);


module.exports = router;