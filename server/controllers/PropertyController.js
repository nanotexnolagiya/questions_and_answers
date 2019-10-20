const express = require('express')
const router = express.Router()
const { Properties, Categories } = require('../models')

const all = async (req, res) => {
  const { limit, page = 1 } = req.query;
  try {
    const count = await Categories.count();
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;
    const properties = await Properties.scope('publicProperties').findAll({
      limit,
      offset
    });

    res.status(200).json({
      ok: true,
      data: properties,
      pageCount: pages
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

const single = async (req, res) => {
  const id = req.params.id;
  try {
    const property = await Properties.scope('publicProperties').findOne({
      where: {
        id
      }
    });

    if (!property) throw new Error('Property not found') 

    res.status(200).json({
      ok: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

const add = async (req, res) => {
  const { name, categoryIds, type } = req.body;
  try {
    if (!name) throw new Error("Name not found");
    if (!categoryIds || categoryIds.length === 0) throw new Error("Category not found");
    if (!type) throw new Error("Type not found");

    const property = await Properties.create({ name, type });

    for (categoryId of categoryIds) {
      const category = await Categories.findOne({
        where: {
          id: categoryId
        }
      })
  
      if (!category) throw new Error("Category not found");
  
      await property.addCategory(category);
    }

    res.status(200).json({
      ok: true
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

const update = async (req, res) => {
  const { name, categoryIds, type } = req.body;
  const id = req.params.id;
  try {

    const property = await Properties.findOne({
      where: {
        id
      }
    });

    if (!property) throw new Error("Category not found");

    if (categoryIds || categoryIds.length > 0) {
      for (categoryId of categoryIds) {
        const category = await Categories.findOne({
          where: {
            id: categoryId
          }
        })
    
        if (!category) throw new Error("Category not found");
    
        await property.updateCategory(category);
      }
    }

    if (name) property.name = name;
    if (type) property.type = type;

    await property.save();

    res.status(200).json({
      ok: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    await Properties.destroy({
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
      message: error.message
    });
  }
};

router.get('/', all)
router.get('/:id', single)
router.post('/', add)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router