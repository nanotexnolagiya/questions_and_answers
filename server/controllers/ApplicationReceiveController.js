const express = require('express')
const router = express.Router()
const {
  ApplicationReceive,
  Categories,
  Properties,
  Users,
  Statuses,
  Things,
  ApplicationReceivePropertyValues
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
    
    const count = await ApplicationReceive.count();
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const data = await ApplicationReceive.findAll({
      where: whereStatement,
      order: orderStatement,
      limit,
      offset,
      include: [
        { model: Statuses },
        { model: Categories },
        { model: Properties },
        { model: Things },
        { model: Users, as: "ApplicationReceiveUser" },
        { model: Users, as: "ApplicationReceiveSupplier" },
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
    const data = await ApplicationReceive.findOne({
      where: {
        id
      },
      include: [
        { model: Statuses },
        { model: Categories },
        { model: Properties },
        { model: Users, as: "ApplicationReceiveUser" },
        { model: Users, as: "ApplicationReceiveSupplier" },
      ]
    });

    if (!data) throw new ResponseException("Заявка не найдена", 400);

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
    let hasThing = false;
    const statusStatement = {}
    if (statusId) {
      statusStatement.where = {
        id: statusId
      }
    } else {
      statusStatement.where = {
        code: "await"
      }
    }
    const status = await Statuses.findOne(statusStatement);
    
    const awaitStatus = await Statuses.findOne({
      where: {
        code: "await"
      }
    });

    const foundMatchStatus = await Statuses.findOne({
      where: {
        code: 'found_match'
      }
    });

    if (!status) throw new ResponseException("Статус не найдена", 400);
    if (!category_id) throw new ResponseException("Категория не найдена", 400);
    if (!properties && properties.length === 0) throw new ResponseException("Свойства не найдена", 400);

    const appReceive = await ApplicationReceive.create({
      userId: req.userData.userId,
      categoryId: category_id,
      statusId: status.id
    });

    await ApplicationReceivePropertyValues.bulkCreate(properties.map(property => ({ applicationReceiveId: appReceive.id, ...property })));

    const things = await Things.findAll({
      where: {
        statusId: awaitStatus.id,
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

    for (const thing of things) {
      const thingValues = thing.dataValues.Properties.map(propertyValues => propertyValues.ThingPropertyValues.value)
      const appValues = properties.map(property => property.value)

      if (arrayEqual(thingValues, appValues)) {
        hasThing = thing
      }
    }

    if (hasThing) {
      appReceive.thingId = hasThing.id
      appReceive.statusId = foundMatchStatus.id
      await appReceive.save();

      hasThing.statusId = foundMatchStatus.id
      await hasThing.save();
    }

    res.status(201).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { properties, category_id, statusId, thingId, supplierId } = req.body;
  const id = req.params.id;

  try {
    const appReceive = await ApplicationReceive.findOne({
      where: {
        id
      }
    });

    if(!appReceive) throw new ResponseException('Заявка не найдена'); 

    if (category_id) {
      const category = await Categories.findOne({
        where: {
          id: category_id
        }
      });
      if (!category) throw new ResponseException('Категория не найдена', 400);
      appReceive.categoryId = category.id
    }

    if (statusId) {
      const status = await Statuses.findOne({
        where: {
          id: statusId
        }
      });
  
      if (!status) throw new ResponseException('Статус не найдена', 400);

      appReceive.statusId = status.id
    }

    if (thingId) {
      const thing = await Things.findOne({
        where: {
          id: thingId
        }
      });

      if (!thing) throw new ResponseException('Вещь не найдена', 400);

      appReceive.thingId = thing.id
    }

    if (supplierId) {
      const supplier = await Users.findOne({
        where: {
          id: supplierId
        }
      });

      if (!supplier) throw new ResponseException('Доставшик не найдена', 400);

      appReceive.supplierId = supplier.id
    }

    if (properties && properties.length > 0) {
      let hasThing = false;
      const awaitStatus = await Statuses.findOne({
        where: {
          code: "await"
        }
      });

      const foundMatchStatus = await Statuses.findOne({
        where: {
          code: 'found_match'
        }
      });

      await ApplicationReceivePropertyValues.destroy({
        where: {
          applicationReceiveId: appReceive.id
        }
      });
      await ApplicationReceivePropertyValues.bulkCreate(properties.map(property => ({ applicationReceiveId: appReceive.id, ...property })));

      const things = await Things.findAll({
        where: {
          statusId: awaitStatus.id,
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
  
      for (const thing of things) {
        const thingValues = thing.dataValues.Properties.map(propertyValues => propertyValues.ThingPropertyValues.value)
        const appValues = properties.map(property => property.value)
  
        if (arrayEqual(thingValues, appValues)) {
          hasThing = thing
        }
      }
  
      if (hasThing) {
        appReceive.thingId = hasThing.id
        appReceive.statusId = foundMatchStatus.id
        await appReceive.save();
  
        hasThing.statusId = foundMatchStatus.id
        await hasThing.save();
      }
    }

    await appReceive.save();

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
    const data = await ApplicationReceive.destroy({
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