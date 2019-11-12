const express = require('express')
const router = express.Router()
const { Properties, Categories, CategoryProperties } = require('../models')

const all = async (req, res, next) => {
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
    next(error);
  }
};

const single = async (req, res, next) => {
  const id = req.params.id;
  try {
    const property = await Properties.scope('publicProperties').findOne({
      where: {
        id
      }
    });

    if (!property) throw new ResponseException('Свойства не найдена', 400) 

    res.status(200).json({
      ok: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  const { name, categoryIds, type } = req.body;
  try {
    if (!name) throw new ResponseException("Название не найдена", 400);
    if (!categoryIds || categoryIds.length === 0) throw new ResponseException("Категория не найдена", 400);
    if (!type) throw new ResponseException("Тип не найдена", 400);

    const property = await Properties.create({ name, type });

    for (categoryId of categoryIds) {
      const category = await Categories.findOne({
        where: {
          id: categoryId
        }
      })
  
      if (!category) throw new ResponseException("Категория не найдена", 400);
  
      await property.addCategories(category);
    }

    res.status(201).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { name, categoryIds, type } = req.body;
  const id = req.params.id;
  try {

    const property = await Properties.findOne({
      where: {
        id
      }
    });

    if (!property) throw new ResponseException("Свойства не найдена", 400);

    if (categoryIds || categoryIds.length > 0) {
      await CategoryProperties.destroy({
        where: {
          propertyId: id
        }
      });
      for (categoryId of categoryIds) {
        const category = await Categories.findOne({
          where: {
            id: categoryId
          }
        })
    
        if (!category) throw new ResponseException("Категория не найдена");
    
        await property.addCategories(category);
      }
    }

    if (name) property.name = name;
    if (type) property.type = type;

    await property.save();

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
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
    next(error);
  }
};

router.get('/', all)
router.get('/:id', single)
router.post('/', add)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router