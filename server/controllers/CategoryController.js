const express = require('express')
const router = express.Router()
const { Categories } = require('../models')
const getTree = require("../utils/tree");
const isRole = require('../routes/middleware/isRole');
const roles = require('../enums/roles');
const latToCyr = require('../utils/latinToCyrilic');

/**
 * @api {get} /categories
 * @apiGroup Categories
 * @apiName GetAllCategories
 * @apiPermission all
 * @apiParam {Number} limit  Limit
 * @apiParam {Number} page  Page number
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object[]} data  Categories
 * @apiSuccess {Number} total_count  Total count
 */
const all = async (req, res, next) => {
  const { limit, page = 1 } = req.query;
  try {
    const count = await Categories.count();
    const offset = limit ? limit * (page - 1) : null;
    const categories = await Categories.findAll({
      limit,
      offset,
      order: [["id", "ASC"]]
    });

    res.status(200).json({
      ok: true,
      data: categories,
      total_count: count
    });
  } catch (error) {
    next(error);
  }
};

const single = async (req, res, next) => {
  const { id } = req.params;
  try {
    const category = await Categories.findOne({
      where: {
        id
      }
    });

    res.status(200).json({
      ok: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {get} /categories/tree
 * @apiGroup Categories
 * @apiName GetAllCategoriesTree
 * @apiPermission all
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object[]} data  Categories Tree
 */
const tree = async (req, res, next) => {
  try {
    const categories = await Categories.findAll({
      order: [["id", "ASC"]]
    });

    const catsTree = await getTree(categories);

    res.status(200).json({
      ok: true,
      data: catsTree
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {post} /categories
 * @apiGroup Categories
 * @apiName CreateCategory
 * @apiPermission ADMINISTRATOR
 * @apiParam {String} name  Category name
 * @apiParam {Number} parent  Parent category ID
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  Created category
 */
const add = async (req, res, next) => {
  const { name, parent } = req.body;
  try {
    if (!name) throw new ResponseException("Название не найдена", 400);

    const data = await Categories.create(
      {
        name: latToCyr(name),
        parent
      }
    );

    res.status(201).json({
      ok: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {put} /categories/:id
 * @apiGroup Categories
 * @apiName UpdateCategory
 * @apiPermission ADMINISTRATOR
 * @apiParam {Number} id  Category id
 * @apiParam {String} name  Category name
 * @apiParam {Number} parent  Parent category ID
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object} data  Created category
 */
const update = async (req, res, next) => {
  const { name, parent } = req.body;
  const id = req.params.id;
  try {

    const category = await Categories.findOne({
      where: {
        id
      }
    });

    if (!category) throw new ResponseException("Категория не найдена", 400);

    if (name) category.name = latToCyr(name);
    if (parent) category.parent = parent;

    await category.save();

    res.status(202).json({
      ok: true,
      data: category
    });
  } catch (error) {
    next(error)
  }
};

/**
 * @api {delete} /categories/:id
 * @apiGroup Categories
 * @apiName RemoveCategory
 * @apiPermission ADMINISTRATOR
 * @apiParam {Number} id  Category id
 * @apiSuccess {Boolean} ok Response status
 */
const remove = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Categories.destroy({
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
};


router.get('/', all);
router.get('/:id', single);
router.get('/tree', tree);
router.post('/', isRole([roles.ADMINISTRATOR]), add);
router.put('/:id', isRole([roles.ADMINISTRATOR]), update);
router.delete('/:id', isRole([roles.ADMINISTRATOR]), remove);

module.exports = router;