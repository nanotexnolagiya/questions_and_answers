const express = require('express')
const router = express.Router()
const { Users, Roles } = require('../models')
const bcrypt = require('bcryptjs')
const filter = require('../utils/filter');
const order = require('../utils/order');
const isRole = require('../routes/middleware/isRole');

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
const me = async (req, res, next) => {
  try {
    if (req.userData) {
      const user = await Users.scope("userPublic").findOne({
        where: {
          id: req.userData.userId
        },
        include: [
          { model: Roles.scope('rolePublic') }
        ]
      });

      if(!user) new ResponseException('Пользовател не найдена', 400);

      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
}

const all = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;

  const columnsFilter = [
    'id',
    'roleId',
    'name',
    'phone'
  ];
  
  try {
    const whereStatement = filter(req.query, columnsFilter);
    const orderStatement = order(sorts);

    const count = await Users.count();
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const users = await Users.scope('userPublic').findAll({
      where: whereStatement,
      order: orderStatement,
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
    next(error);
  }
}

const add = async (req, res, next) => {
  const { name, phone, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);

    await Users.create({
      name,
      phone,
      password: hash,
      roleId: role
    });

    res.status(201).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
}

const remove = async (req, res, next) => {
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
    next(error);
  }
}

const update = async (req, res, next) => {
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
    if (role) user.roleId = role

    await user.save()

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
}

const meUpdate = async (req, res, next) => {
  const { name, phone, password, newPassword } = req.body;
  try {

    const user = await Users.findOne({
      where: {
        id: req.userData.userId
      }
    });

    const match = await bcrypt.compare(password, user.password)

    if (match && newPassword) {
      const hash = await bcrypt.hash(newPassword, 10)

      user.password = hash
    }

    if (name) user.name = name
    if (phone) user.phone = phone

    await user.save()

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
}

router.get('/', isRole(['admin']), all);
router.post('/', isRole(['admin']), add);
router.delete('/:id', isRole(['admin']), remove);
router.put('/:id', isRole(['admin']), update);
router.get('/me', me);
router.post('/me', meUpdate);


module.exports = router;