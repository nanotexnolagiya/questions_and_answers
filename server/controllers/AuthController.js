const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const roles = require('../enums/roles');

/**
 * @api {post} /auth/signup/
 * @apiGroup Auth
 * @apiName UserSignUp
 * @apiPermission user
 * @apiParam {String} username  User name
 * @apiParam {String} phone  User phone number
 * @apiParam {String} email  User email
 * @apiParam {String} password  User password
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {String} token  Access token
 * @apiSuccess {String} role  User role
 */
const signup = async (req, res, next) => {
  const { username, phone, password, email } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);

    let hasUser = await Users.findOne({
      where: {
        phone
      }
    });

    if (!hasUser) {
      
      const user = await Users.create({
        username,
        email,
        phone,
        password: hash,
        role: roles.USER
      });

      const token = await jwt.sign(
        {
          role: user.role,
          user_id: user.id
        },
        config.SECRET_KEY,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        ok: true,
        token,
        role: user.role
      });
    } else {
      throw new ResponseException('Пользоватеь уже существует', 400);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @api {post} /auth/signin/
 * @apiGroup Auth
 * @apiName AllSignIn
 * @apiPermission all
 * @apiParam {String} phone  User phone number
 * @apiParam {String} password  User password
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {String} token  Access token
 * @apiSuccess {String} role  User role
 */
const signin = async (req, res, next) => {
  const { phone, password } = req.body;
  try {
    const user = await Users.findOne({
      where: {
        phone
      }
    });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = await jwt.sign(
          {
            role: user.role,
            user_id: user.id
          },
          config.SECRET_KEY,
          { expiresIn: '7d' }
        );

        res.status(200).json({
          ok: true,
          token,
          role: user.role
        });
      } else {
        throw new ResponseException('Ошибка в авторизации', 400);
      }
    } else {
      throw new ResponseException('Ошибка в авторизации', 400);
    }
  } catch (error) {
    next(error)
  }
};

router.post('/signin', signin);
router.post('/signup', signup);

module.exports = router;
