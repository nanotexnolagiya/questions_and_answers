const express = require('express');
const router = express.Router();
const { Users, Questions, Categories } = require('../models');
const bcrypt = require('bcryptjs')
const filter = require('../utils/filter');
const order = require('../utils/order');
const isRole = require('../routes/middleware/isRole');
const roles = require('../enums/roles');
const statuses = require('../enums/status');
const config = require('../config');
const latToCyr = require('../utils/latinToCyrilic');

/**
 * @api {get} /account/questions
 * @apiGroup Account
 * @apiName GetAccountQuestions
 * @apiPermission all
 * @apiParam {Number} limit  Limit
 * @apiParam {Number} page  Page number
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object[]} data  Questions List
 * @apiSuccess {Number} total_count  Total count
 */
const allQuestions = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;

  const columnsFilter = [
    'id',
    'title',
    'question',
    'answer',
    'status',
    'is_private',
    'category_id',
    'answered_user_id'
  ];
  
  try {
    const whereStatement = filter(req.query, columnsFilter);
    whereStatement.user_id = req.user.user_id;
    const orderStatement = order(sorts);

    const count = await Questions.count({
      where: whereStatement
    });
    const offset = limit ? limit * (page - 1) : null;

    const questions = await Questions.findAll({
      where: whereStatement,
      order: orderStatement,
      limit,
      offset,
      include: [
        { as: 'category', model: Categories, attributes: ['name'] },
        { as: 'answered_user', model: Users, attributes: ['username'] }
      ]
    });

    res.status(200).json({
      ok: true,
      data: questions,
      total_count: count
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {get} /account/questions/:id
 * @apiGroup Account
 * @apiName GetAccountQuestionById
 * @apiPermission all
 * @apiParam {Number} id  ID user question
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  Question
 */
const singleQuestion = async (req, res, next) => {
  const id = req.params.id;
  try {
    const question = await Questions.findOne({
      where: {
        id,
        user_id: req.user.user_id
      },
      include: [
        { as: 'category', model: Categories, attributes: ['name'] },
        { as: 'user', model: Users, attributes: ['username'] },
        { as: 'answered_user', model: Users, attributes: ['username'] }
      ]
    });

    res.status(200).json({
      ok: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {post} /account/questions
 * @apiGroup Account
 * @apiName AddQuestion
 * @apiPermission all
 * @apiParam {String} title Question title
 * @apiParam {String} question Question description
 * @apiParam {Boolean} question Question is private
 * @apiParam {Number} category_id  Question category id
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  Question
 */
const addQuestion = async (req, res, next) => {
  const { title, question, is_private, category_id} = req.body;
  try {

    const data = await Questions.create({
      title: latToCyr(title),
      question: latToCyr(question),
      status: statuses.PENDING,
      is_private,
      category_id,
      user_id: req.user.user_id
    });

    res.status(201).json({
      ok: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {put} /account/questions/:id
 * @apiGroup Account
 * @apiName UpdateAccountQuestionById
 * @apiPermission all
 * @apiParam {Number} id  Id user question
 * @apiParam {String} title Question title
 * @apiParam {String} question Question description
 * @apiParam {Boolean} question Question is private
 * @apiParam {Number} category_id  Question category id
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  Question
 */
const updateQuestion = async (req, res, next) => {
  const id = req.params.id;
  const { title, question, is_private, category_id} = req.body;
  try {

    const data = await Questions.findOne({
      where: {
        id,
        user_id: req.user.user_id
      }
    });

    if (data.status !== statuses.ANSWERED) {
      if (title) data.title = latToCyr(title);
      if (question) data.question = latToCyr(question);
      if (is_private) data.is_private = is_private;
      if (category_id) data.category_id = category_id;
    } else throw new ResponseException("На вопрос уже отвечено", 400);

    await data.save()

    res.status(202).json({
      ok: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {get} /account/answers/not-answers
 * @apiGroup Account
 * @apiName GetNotAnsweredQuestions
 * @apiPermission MODERATOR
 * @apiParam {Number} limit  Limit
 * @apiParam {Number} page  Page number
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object[]} data  Questions List
 */
const notAnswers = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;

  const columnsFilter = [
    'is_private',
    'category_id'
  ];
  
  try {
    const whereStatement = filter(req.query, columnsFilter);
    whereStatement.status = statuses.PENDING;
    whereStatement.answer = null;
    const orderStatement = order(sorts);

    const count = await Questions.count({
      where: whereStatement
    });
    const offset = limit ? limit * (page - 1) : null;

    const questions = await Questions.findAll({
      where: whereStatement,
      order: orderStatement,
      limit,
      offset,
      include: [
        { as: 'category', model: Categories, attributes: ['name'] },
        { as: 'user', model: Users, attributes: ['username'] }
      ]
    });

    res.status(200).json({
      ok: true,
      data: questions,
      total_count: count
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {get} /account/answers/not-answers/:id
 * @apiGroup Account
 * @apiName GetNotAnsweredQuestionsById
 * @apiPermission MODERATOR
 * @apiParam {Number} id  Question id
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  Question
 */
const notAnswersSingle = async (req, res, next) => {
  const id = req.params.id;
  try {
    const question = await Questions.findOne({
      where: {
        id,
        status: statuses.PENDING,
        answered_user_id: null
      },
      include: [
        { as: 'category', model: Categories, attributes: ['name'] },
        { as: 'user', model: Users, attributes: ['username'] }
      ]
    });

    res.status(200).json({
      ok: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {post} /account/answers/not-answers/:id
 * @apiGroup Account
 * @apiName SetAnsweredQuestionsById
 * @apiPermission MODERATOR
 * @apiParam {Number} id  Question id
 * @apiParam {String} answer  Question answer
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  Question
 */
const createAnswer = async (req, res, next) => {
  const id = req.params.id;
  const { answer } = req.body;
  try {
    if (!answer) throw new ResponseException("Название не найдена", 400);

    const question = await Questions.findOne({
      where: {
        id,
        status: statuses.PENDING,
        answered_user_id: null
      },
      include: [
        { as: 'category', model: Categories, attributes: ['name'] },
        { as: 'user', model: Users, attributes: ['username'] }
      ]
    });

    if (answer) {
      question.answer = latToCyr(answer);
      question.answered_user_id = req.user.user_id;
    }

    await question.save();

    res.status(200).json({
      ok: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {get} /account/answers
 * @apiGroup Account
 * @apiName GetUserAnsweredQuestions
 * @apiPermission MODERATOR
 * @apiParam {Number} limit  Limit
 * @apiParam {Number} page  Page number
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object[]} data  Questions List
 */
const answers = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;
  
  try {
    const whereStatement = filter(req.query, columnsFilter);
    whereStatement.status = statuses.ANSWERED;
    whereStatement.answered_user_id = req.user.user_id;
    const orderStatement = order(sorts);

    const count = await Questions.count({
      where: whereStatement
    });
    const offset = limit ? limit * (page - 1) : null;

    const questions = await Questions.findAll({
      where: whereStatement,
      order: orderStatement,
      limit,
      offset,
      include: [
        { as: 'category', model: Categories, attributes: ['name'] },
        { as: 'user', model: Users, attributes: ['username'] }
      ]
    });

    res.status(200).json({
      ok: true,
      data: questions,
      total_count: count
    });
  } catch (error) {
    next(error);
  }
}


/**
 * @api {get} /account/answers
 * @apiGroup Account
 * @apiName GetUserAnsweredQuestionById
 * @apiPermission MODERATOR
 * @apiParam {Number} id  ID user answered question
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  Question
 */
const answersSingle = async (req, res, next) => {
  const id = req.params.id;
  try {
    const question = await Questions.findOne({
      where: {
        id,
        status: statuses.ANSWERED,
        answered_user_id: req.user.user_id
      },
      include: [
        { as: 'category', model: Categories, attributes: ['name'] },
        { as: 'user', model: Users, attributes: ['username'] }
      ]
    });

    res.status(200).json({
      ok: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {put} /account/answers/:id
 * @apiGroup Account
 * @apiName UpdateAccountAnswerById
 * @apiPermission MODERATOR
 * @apiParam {Number} id  Id user answered question
 * @apiParam {String} answer  Question answer
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  Question
 */
const updateAnswer = async (req, res, next) => {
  const id = req.params.id;
  const { answer } = req.body;
  try {
    if (!answer) throw new ResponseException("Название не найдена", 400);
    const question = await Questions.findOne({
      where: {
        id,
        status: statuses.ANSWERED,
        answered_user_id: req.user.user_id
      },
      include: [
        { as: 'category', model: Categories, attributes: ['name'] },
        { as: 'user', model: Users, attributes: ['username'] }
      ]
    });

    if (answer) {
      question.answer = latToCyr(answer);
    }

    await question.save();

    res.status(200).json({
      ok: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {delete} /account/answers/:id
 * @apiGroup Account
 * @apiName DeleteAccountAnswerById
 * @apiPermission MODERATOR
 * @apiParam {Number} id  Id user answered question
 * @apiSuccess {Boolean} ok Response status
 */
const removeAnswer = async (req, res, next) => {
  const id = req.params.id;
  try {
    const question = await Questions.findOne({
      where: {
        id,
        status: statuses.ANSWERED,
        answered_user_id: req.user.user_id
      },
      include: [
        { as: 'category', model: Categories, attributes: ['name'] },
        { as: 'user', model: Users, attributes: ['username'] }
      ]
    });

    question.status = statuses.REMOVED;

    await question.save();

    res.status(200).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {get} /account/me
 * @apiGroup Account
 * @apiName GetAccountInfo
 * @apiPermission all
 * @apiParam {Number} id  Id user answered question
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  Current User
 * @apiSuccess {String} token  Refreshed token
 */
const me = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      attributes: ['id', 'username', 'email', 'phone', 'role'],
      where: {
        id: req.user.user_id
      }
    });

    if(!user) new ResponseException('Пользовател не найдена', 400);

    const refreshToken = await jwt.sign(
      {
        role: user.role,
        user_id: user.id
      },
      config.SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      ok: true,
      data: user,
      token: refreshToken
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @api {put} /account/me
 * @apiGroup Account
 * @apiName UpdateAccountInfo
 * @apiPermission all
 * @apiParam {String} username  User name
 * @apiParam {String} phone  User phone
 * @apiParam {String} email  User email
 * @apiParam {String} password  User old password
 * @apiParam {String} newPassword  User new password
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  Current User
 * @apiSuccess {String} token  Refreshed token
 */
const meUpdate = async (req, res, next) => {
  const { username, phone, email, password, newPassword } = req.body;
  try {

    const user = await Users.findOne({
      where: {
        id: req.user.user_id
      }
    });

    const match = await bcrypt.compare(password, user.password)

    if (match && newPassword) {
      const hash = await bcrypt.hash(newPassword, 10)

      user.password = hash
    }

    if (username) user.username = username
    if (phone) user.phone = phone
    if (email) user.email = email

    await user.save()

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
}

router.get('/me', me);
router.put('/me', meUpdate);

router.get('/questions', allQuestions);
router.get('/questions/:id', singleQuestion);
router.post('/questions', addQuestion);
router.put('/questions/:id', updateQuestion);

router.get('/answers', isRole([roles.MODERATOR]), answers);
router.get('/answers/:id', isRole([roles.MODERATOR]), answersSingle);
router.put('/answers/:id', isRole([roles.MODERATOR]), updateAnswer);
router.delete('/answers/:id', isRole([roles.MODERATOR]), removeAnswer);

router.get('/answers/not-answers', isRole([roles.MODERATOR]), notAnswers);
router.get('/answers/not-answers/:id', isRole([roles.MODERATOR]), notAnswersSingle);
router.post('/answers/not-answers/:id', isRole([roles.MODERATOR]), createAnswer);


module.exports = router;