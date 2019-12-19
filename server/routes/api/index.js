const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const isRole = require('../../routes/middleware/isRole');
const roles = require('../../enums/roles');
const statuses = require('../../enums/status');
const {
  AuthController,
  CategoryController,
  UserController,
  AccountController,
  QuestionController,
  SearchController
} = require('../../controllers');

router.use('/auth', AuthController);

router.use(checkAuth);

router.get('/roles', isRole([roles.ADMINISTRATOR]), (_, res) => res.status(200).json({ ok: true, data: roles }))
router.get('/statuses', isRole([roles.ADMINISTRATOR]), (_, res) => res.status(200).json({ ok: true, data: statuses }))

router.use('/categories', CategoryController);
router.use('/users', UserController);
router.use('/account', AccountController);
router.use('/search', SearchController);
router.use('/questions', isRole([roles.ADMINISTRATOR]), QuestionController);

module.exports = router;
