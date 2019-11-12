const express = require('express')
const router = express.Router()
const {
  ApplicationReceive,
  Categories,
  Properties,
  ApplicationTransfer,
  Uploads,
  Users,
  Statuses,
  Things,
  ApplicationReceivePropertyValues
} = require("../models");
const filter = require('../utils/filter');
const order = require('../utils/order');
const arrayEqual = require('../utils/arrayEqual');


const allReceives = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;

  const columnsFilter = [
    'statusId'
  ];
  
  try {
    let whereStatement = filter(req.query, columnsFilter);
    whereStatement.userId = req.userData.userId
    const orderStatement = order(sorts);
    
    const count = await ApplicationReceive.count({
      where: {
        userId: whereStatement.userId
      }
    });
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

const singleReceives = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await ApplicationReceive.findOne({
      where: {
        id,
        userId: req.userData.userId
      },
      include: [
        { model: Statuses },
        { model: Categories },
        { model: Properties },
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

const addReceives = async (req, res, next) => {
  const { properties, category_id } = req.body;

  try {
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

    if (!category_id) throw new ResponseException("Категория не найдена", 400);
    if (!properties && properties.length === 0) throw new ResponseException("Свойства не найдена", 400);

    const appReceive = await ApplicationReceive.create({
      userId: req.userData.userId,
      categoryId: category_id,
      statusId: awaitStatus.id
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

const updateReceives = async (req, res, next) => {
  const { properties, category_id, delivered } = req.body;
  const id = req.params.id;

  try {
    const appReceive = await ApplicationReceive.findOne({
      where: {
        id,
        userId: req.userData.userId
      }
    });

    if(!appReceive) throw new ResponseException('Заявка не найдена'); 

    const deliveredStatus = await Statuses.findOne({
      where: {
        code: 'delivered'
      }
    });

    if (delivered) data.statusId = deliveredStatus.id 

    if (category_id) {
      const category = await Categories.findOne({
        where: {
          id: category_id
        }
      });
      if (!category) throw new ResponseException('Категория не найдена', 400);
      appReceive.categoryId = category.id
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

const removeReceives = async (req, res, next) => {
  const id = req.params.id;

  try {
    const cancelledStatus = await Statuses.findOne({
      where: {
        code: 'cancelled'
      }
    });

    const data = await ApplicationReceive.findOne({
      where: {
        id,
        userId: req.userData.userId
      }
    });

    if (!data) throw new ResponseException('Заявка не найдена');

    data.statusId = cancelledStatus.id;
    await data.save();

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------

const allTransfers = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;

  const columnsFilter = [
    'statusId'
  ];
  
  try {
    const whereStatement = filter(req.query, columnsFilter);
    const orderStatement = order(sorts);

    whereStatement.userId = req.userData.userId
    
    const count = await ApplicationTransfer.count({
      where: {
        userId: whereStatement.userId
      }
    });
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const data = await ApplicationTransfer.findAll({
      where: whereStatement,
      order: orderStatement,
      limit,
      offset,
      include: [
        { model: Uploads },
        { model: Users, as: "ApplicationTransferSupplier" },
        { model: Statuses }
      ]
    });

    res.status(200).json({
      ok: true,
      data,
      pageCount: pages
    });
  } catch (error) {
    next(error)
  }
};

const singleTransfers = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await ApplicationTransfer.findOne({
      where: {
        id,
        userId: req.userData.userId
      },
      include: [
        { model: Uploads },
        { model: Users, as: "ApplicationTransferSupplier" },
        { model: Statuses }
      ]
    });

    if (!data) throw new ResponseException("Заявка не найдена", 400);

    res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    next(error)
  }
};

const addTransfers = async (req, res, next) => {
  const { text, upload_ids = [] } = req.body;

  try {
    const status = await Statuses.findOne({
      where: {
        code: "await"
      }
    });

    if (!status) throw new ResponseException("Статус не найдена");

    const data = await ApplicationTransfer.create({
      userId: req.userData.userId,
      text,
      statusId: status.id
    });

    if (upload_ids.length !== 0) {
      const uploads = await Uploads.findAll({
        where: {
          id: {
            $in: upload_ids
          }
        }
      });

      await data.addUploads(uploads);
    }

    res.status(200).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

const updateTransfers = async (req, res, next) => {
  const { text, upload_ids = [], delivered } = req.body;
  const id = req.params.id;

  try {

    const data = await ApplicationTransfer.findOne({
      where: {
        id,
        userId: req.userData.userId
      }
    });

    if(!data) throw new ResponseException('Заявка не найдена'); 

    const deliveredStatus = await Statuses.findOne({
      where: {
        code: 'delivered'
      }
    });

    if (delivered) data.statusId = deliveredStatus.id 

    if (text) data.text = text

    if (upload_ids.length !== 0) {
      const uploads = await Uploads.findAll({
        where: {
          id: {
            $in: upload_ids
          }
        }
      });

      await data.setUploads(uploads);
    }

    await data.save();

    res.status(200).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

const removeTransfers = async (req, res, next) => {
  const id = req.params.id;

  try {
    const data = await ApplicationTransfer.findOne({
      where: {
        id,
        userId: req.userData.userId
      }
    });
    const cancelledStatus = await Statuses.findOne({
      where: {
        code: 'cancelled'
      }
    });

    if (!data) throw new ResponseException('Заявка не найдена', 400)

    data.statusId = cancelledStatus.id

    await data.save()

    res.status(200).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

router.get('/app-receives', allReceives);
router.get('/app-receives/:id', singleReceives);
router.put('/app-receives/:id', updateReceives);
router.post('/app-receives/', addReceives);
router.delete('/app-receives/:id', removeReceives);
// -----------------------------------------------------
router.get('/app-transfers', allTransfers);
router.get('/app-transfers/:id', singleTransfers);
router.put('/app-transfers/:id', updateTransfers);
router.post('/app-transfers/', addTransfers);
router.delete('/app-transfers/:id', removeTransfers);


module.exports = router;