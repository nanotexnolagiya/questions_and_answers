const express = require('express');
const router = express.Router();
const { Users, Questions, Categories } = require('../models');
const filter = require('../utils/filter');
const order = require('../utils/order');
const isRole = require('../routes/middleware/isRole');
const roles = require('../enums/roles');
const latToCyr = require('../utils/latinToCyrilic');

/**
 * @api {get} /questions
 * @apiGroup Questions
 * @apiName GetAllQuestions
 * @apiPermission ADMINISTRATOR
 * @apiParam {Number} limit  Limit
 * @apiParam {Number} page  Page number
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object[]} data  Questions
 * @apiSuccess {Number} total_count  Total count
 */
const all = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;

  const columnsFilter = [
    'id',
    'title',
    'question',
    'answer',
    'status',
    'is_private',
    'category_id',
    'user_id',
    'answered_user_id'
  ];
  
  try {
    const whereStatement = filter(req.query, columnsFilter);
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
        { as: 'user', model: Users, attributes: ['username'] },
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
 * @api {get} /questions/:id
 * @apiGroup Questions
 * @apiName GetQuestionById
 * @apiPermission ADMINISTRATOR
 * @apiParam {Number} id  Question ID
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data Question
 */
const single = async (req, res, next) => {
  const id = req.params.id;
  try {
    const question = await Questions.findOne({
      where: {
        id
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
 * @api {post} /questions
 * @apiGroup Questions
 * @apiName AddQuestion
 * @apiPermission ADMINISTRATOR
 * @apiParam {String} title  Question title
 * @apiParam {String} question  Question question
 * @apiParam {String} status  Question status
 * @apiParam {Boolean} is_private  Question is_private
 * @apiParam {Number} is_private  Question category ID
 * @apiParam {Number} user_id  Question user ID
 * @apiParam {Number} answered_user_id  Question answered user ID
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data Question
 */
const add = async (req, res, next) => {
  const { title, question, answer, status, is_private, category_id, user_id, answered_user_id} = req.body;
  try {

    const data = await Questions.create({
      title: latToCyr(title),
      question: latToCyr(question),
      answer: latToCyr(answer),
      status,
      is_private,
      category_id,
      user_id: user_id ? user_id : req.user.user_id,
      answered_user_id
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
 * @api {delete} /questions/:id
 * @apiGroup Questions
 * @apiName DeleteQuestion
 * @apiPermission ADMINISTRATOR
 * @apiParam {Number} id  Question ID
 * @apiSuccess {Boolean} ok Response status
 */
const remove = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Questions.destroy({
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
 * @api {put} /questions/:id
 * @apiGroup Questions
 * @apiName UpdateQuestion
 * @apiPermission ADMINISTRATOR
 * @apiParam {Number} id  Question ID
 * @apiParam {String} title  Question title
 * @apiParam {String} question  Question question
 * @apiParam {String} status  Question status
 * @apiParam {Boolean} is_private  Question is_private
 * @apiParam {Number} is_private  Question category ID
 * @apiParam {Number} user_id  Question user ID
 * @apiParam {Number} answered_user_id  Question answered user ID
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data Question
 */
const update = async (req, res, next) => {
  const id = req.params.id;
  const { title, question, answer, status, is_private, category_id, user_id, answered_user_id} = req.body;
  try {

    const data = await Questions.findOne({
      where: {
        id
      }
    });

    if (title) data.title = latToCyr(title);
    if (question) data.question = latToCyr(question);
    if (answer) data.answer = latToCyr(answer);
    if (is_private) data.is_private = is_private;
    if (status) data.status = status;
    if (category_id) data.category_id = category_id;
    if (user_id) data.user_id = user_id;
    if (answered_user_id) data.answered_user_id = answered_user_id;

    await data.save()

    res.status(202).json({
      ok: true,
      data
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