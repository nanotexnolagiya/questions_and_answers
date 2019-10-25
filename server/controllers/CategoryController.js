const express = require('express')
const router = express.Router()
const { Categories, Properties } = require('../models')
const getTree = require("../utils/tree");

const all = async (req, res, next) => {
  const { limit, page = 1 } = req.query;
  try {
    const count = await Categories.count();
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;
    const categories = await Categories.findAll({
      limit,
      offset,
      order: [["id", "ASC"]]
    });

    res.status(200).json({
      ok: true,
      data: categories,
      pageCount: pages
    });
  } catch (error) {
    next(error);
  }
};

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

const add = async (req, res, next) => {
  const { name, parent = 0 } = req.body;
  try {
    if (!name) throw new ResponseException("Name not found", 400);

    await Categories.create(
      {
        name,
        parentId: parent
      }
    );

    res.status(201).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { name, parent } = req.body;
  const id = req.params.id;
  try {

    const category = await Categories.findOne({
      where: {
        id
      }
    });

    if (!category) throw new ResponseException("Category not found", 400);

    if (name) category.name = name;
    if (parent) category.parentId = parent;

    await category.save();

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error)
  }
};

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

const properties = async (req, res, next) => {
  const id = req.params.id;

  try {
    const category = await Categories.findOne({
      where: {
        id
      },
      include: [
        { model: Properties }
      ]
    });

    if (!category) new ResponseException('category not found', 400);

    res.status(200).json({
      ok: true,
      data: category.Properties
    })
  } catch (error) {
    next(error);
  }
}

router.get('/', all)
router.get('/tree', tree)
router.post('/', add)
router.put('/:id', update)
router.delete('/:id', remove)
router.get('/:id/properties', properties)

module.exports = router