const express = require('express')
const router = express.Router()
const {
  Things,
  Categories,
  Properties,
  Statuses,
  ApplicationReceive,
  ThingPropertyValues
} = require("../models");
const filter = require('../utils/filter');
const order = require('../utils/order');
const arrayEqual = require('../utils/arrayEqual');


const all = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;

  const columnsFilter = [
    'id',
    'categoryId',
    'statusId'
  ];
  
  try {
    const whereStatement = filter(req.query, columnsFilter);
    const orderStatement = order(sorts);
    
    const count = await Things.count();
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const data = await Things.findAll({
      where: whereStatement,
      order: orderStatement,
      limit,
      offset,
      include: [
        { model: Statuses },
        { model: Categories },
        { model: Properties }
      ]
    });

    res.status(200).json({
      ok: true,
      data,
      pageCount: pages
    });
  } catch (error) {
    next(error);
  }
};

const single = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await Things.findOne({
      where: {
        id
      },
      include: [
        { model: Statuses },
        { model: Categories },
        { model: Properties }
      ]
    });

    if (!data) throw new ResponseException("Thing not found", 404);

    res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  const { properties, category_id, statusId } = req.body;

  try {
    let hasAppReceive = false;
    const statusStatement = {}
    if (statusId) {
      statusStatement.where = {
        id: statusId
      }
    } else {
      statusStatement.where = {
        code: "expects"
      }
    }
    const status = await Statuses.findOne(statusStatement);
    
    const exceptStatus = await Statuses.findOne({
      where: {
        code: "expects"
      }
    });

    const foundMatchStatus = await Statuses.findOne({
      where: {
        code: 'found_match'
      }
    });

    if (!status) throw new ResponseException("Status not found", 400);
    if (!category_id) throw new ResponseException("Category not found", 400);
    if (!properties && properties.length === 0) throw new ResponseException("Properties not found", 400);

    const thing = await Things.create({
      categoryId: category_id,
      statusId: status.id
    });

    await ThingPropertyValues.bulkCreate(properties.map(property => ({ thingId: thing.id, ...property })));

    const appReceives = await ApplicationReceive.findAll({
      where: {
        statusId: exceptStatus.id,
        categoryId: category_id
      },
      include: [
        {
          model: Properties,
          where: {
            id: {
              $in: properties.map(property => property.propertyId)
            }
          }
        }
      ]
    });

    let d = {}

    for (const appReceive of appReceives) {
      d[appReceive.id] = {}
      const appValues = appReceive.dataValues.Properties.map(propertyValues => propertyValues.ApplicationReceivePropertyValues.value)
      const thingValues = properties.map(property => property.value)

      d[appReceive.id]['t'] = thingValues
      d[appReceive.id]['a'] = appValues
      if (arrayEqual(thingValues, appValues)) {
        hasAppReceive = appReceive
      }
    }

    if (hasAppReceive) {
      thing.statusId = foundMatchStatus.id
      await thing.save();

      hasAppReceive.statusId = foundMatchStatus.id
      hasAppReceive.thingId = thing.id
      await hasAppReceive.save();
    }

    res.status(201).json({
      ok: true,
      data: d,
      rec: hasAppReceive
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { text, upload_ids = [], statusId } = req.body;
  const id = req.params.id;

  try {

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
    const data = await Things.destroy({
      where: {
        id
      }
    });

    res.status(200).json({
      ok: Boolean(data)
    });
  } catch (error) {
    next(error);
  }
};

router.get('/', all);
router.get('/:id', single);
router.put('/:id', update);
router.post('/', add);
router.delete('/:id', remove);


module.exports = router;