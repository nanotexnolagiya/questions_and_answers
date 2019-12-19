const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcryptjs')
const filter = require('../utils/filter');
const order = require('../utils/order');
const isRole = require('../routes/middleware/isRole');
const roles = require('../enums/roles');

/**
 * @api {get} /users
 * @apiGroup Users
 * @apiName GetAllUsers
 * @apiPermission ADMINISTRATOR
 * @apiParam {Number} limit  Limit
 * @apiParam {Number} page  Page number
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object[]} data  Users list
 * @apiSuccess {Number} total_count  Total count
 */
const all = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;

  const columnsFilter = [
    'id',
    'role',
    'username',
    'email',
    'phone'
  ];
  
  try {
    const whereStatement = filter(req.query, columnsFilter);
    const orderStatement = order(sorts);

    const count = await Users.count({
      where: whereStatement
    });
    const offset = limit ? limit * (page - 1) : null;

    const users = await Users.findAll({
      attributes: columnsFilter,
      where: whereStatement,
      order: orderStatement,
      limit,
      offset
    });

    res.status(200).json({
      ok: true,
      data: users,
      total_count: count
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {get} /users/:id
 * @apiGroup Users
 * @apiName GetUserById
 * @apiPermission ADMINISTRATOR
 * @apiParam {Number} id  User ID
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  User
 */
const single = async (req, res, next) => {
  const id = req.params.id;
  
  try {
    const user = await Users.findOne({
      attributes: ['id', 'role', 'username', 'email', 'phone'],
      where: {
        id
      }
    });

    res.status(200).json({
      ok: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {post} /users
 * @apiGroup Users
 * @apiName AddUser
 * @apiPermission ADMINISTRATOR
 * @apiParam {String} username  User name
 * @apiParam {String} phone  User phone
 * @apiParam {String} password  User password
 * @apiParam {String} role  User role
 * @apiParam {String} email  User email
 * @apiSuccess {Boolean} ok Response status
 */
const add = async (req, res, next) => {
  const { username, phone, password, role, email } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);

    let hasUser = await Users.findOne({
      where: {
        phone
      }
    });

    if (!hasUser) {
      await Users.create({
        username,
        email,
        phone,
        password: hash,
        role
      });
    } else {
      throw new ResponseException('Пользоватеь уже существует', 400);
    }

    res.status(201).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {delete} /users/:id
 * @apiGroup Users
 * @apiName DeleteUserById
 * @apiPermission ADMINISTRATOR
 * @apiParam {Number} id  User ID
 * @apiSuccess {Boolean} ok Response status
 */
const remove = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Users.destroy({
      where: {
        id
      }
    });

    res.status(200).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {post} /users
 * @apiGroup Users
 * @apiName AddUser
 * @apiPermission ADMINISTRATOR
 * @apiParam {Number} id  User ID
 * @apiParam {String} username  User name
 * @apiParam {String} phone  User phone
 * @apiParam {String} password  User password
 * @apiParam {String} newPassword  User new password
 * @apiParam {String} role  User role
 * @apiParam {String} email  User email
 * @apiSuccess {Boolean} ok Response status
 */
const update = async (req, res, next) => {
  const id = req.params.id;
  const { username, phone, password, role, newPassword, email } = req.body;
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

    if (username) user.username = username
    if (email) user.email = email
    if (phone) user.phone = phone
    if (role) user.role = role

    await user.save()

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
}

router.get('/', isRole([roles.ADMINISTRATOR]), all);
router.get('/:id', isRole([roles.ADMINISTRATOR]), single);
router.post('/', isRole([roles.ADMINISTRATOR]), add);
router.delete('/:id', isRole([roles.ADMINISTRATOR]), remove);
router.put('/:id', isRole([roles.ADMINISTRATOR]), update);


module.exports = router;