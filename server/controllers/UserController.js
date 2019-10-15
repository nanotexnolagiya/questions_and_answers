const express = require('express')
const router = express.Router()
const { Users, Roles } = require('../models')
const bcrypt = require('bcryptjs')

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
      message: error.message
    })
  }
}

const all = async (req, res) => {
  const { limit, page = 1 } = req.query;
  try {
    const count = await Users.count();
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const users = await Users.scope('userPublic').findAll({
      limit,
      offset,
      include: [
        { model: Roles }
      ]
    });

    res.status(200).json({
      ok: true,
      data: users,
      pageCount: pages
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: error.message
    });
  }
}

const add = async (req, res) => {
  const { name, phone, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);

    await Users.create({
      name,
      phone,
      password: hash,
      role_id: role
    });

    res.status(200).json({
      ok: true
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: error.message
    });
  }
}

const remove = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await Users.destroy({
      where: {
        id
      }
    });

    res.status(200).json({
      ok: Boolean(user)
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: error.message
    });
  }
}

const update = async (req, res) => {
  const id = req.params.id;
  const { name, phone, password, role, newPassword } = req.body;
  try {

    const user = await Users.findOne({
      where: {
        id
      }
    });

    const match = await bcrypt.compare(password, user.password)

    if (match && newPassword) {
      const hash = await bcrypt.hash(newPassword, 10)

      user.password = hash
    }

    if (name) user.name = name
    if (phone) user.phone = phone
    if (role) user.role_id = role

    await user.save()

    res.status(200).json({
      ok: true
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: error.message
    });
  }
}

router.get('/', all);
router.post('/', add);
router.delete('/:id', remove);
router.put('/:id', update);
router.post('/me', me);


module.exports = router;