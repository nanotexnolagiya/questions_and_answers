const express = require('express')
const router = express.Router()
const { Categories } = require('../models')
const getTree = require("../utils/tree");

const all = async (req, res) => {
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
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

const tree = async (req, res) => {
  try {
    const categories = await Categories.findAll({
      order: [["id", "ASC"]]
    });

    const catsTree = await getTree(categories);

    res.status(200).json({
      ok: true,
      data: catsTree
      // pageCount: pages
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

const add = async (req, res) => {
  const { name, parent = 0 } = req.body;
  try {
    if (!name) throw new Error("Name not found");

    await Categories.create(
      {
        name,
        parentId: parent
      }
    );

    res.status(200).json({
      ok: true
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

const update = async (req, res) => {
  const { name, parent } = req.body;
  const id = req.params.id;
  try {

    const category = await Categories.findOne({
      where: {
        id
      }
    });

    if (!category) throw new Error("Category not found");

    if (name) category.name = name;
    if (parent) category.parentId = parent;

    await category.save();

    res.status(200).json({
      ok: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

const remove = async (req, res) => {
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
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

router.get('/', all)
router.get('/tree', tree)
router.post('/', add)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router