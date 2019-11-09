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
  Things
} = require("../models");
const order = require('../utils/order');
const isRole = require('../routes/middleware/isRole');

const allReceives = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;
  
  try {
    const orderStatement = order(sorts);
    
    const count = await ApplicationReceive.count({
      where: {
        supplierId: req.userData.userId
      }
    });
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const inTheWayStatus = await Statuses.findOne({
      where: {
        code: 'in_the_way'
      }
    });

    const data = await ApplicationReceive.findAll({
      where: {
        supplierId: req.userData.userId,
        statusId: inTheWayStatus.id
      },
      order: orderStatement,
      limit,
      offset,
      include: [
        { model: Statuses },
        { model: Categories },
        { model: Properties },
        { model: Things },
        { model: Users, as: "ApplicationReceiveUser" },
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

const confirmedReceives = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;
  
  try {
    const orderStatement = order(sorts);

    const confirmedStatus = await Statuses.findOne({
      where: {
        code: 'confirmed'
      }
    });
    
    const count = await ApplicationReceive.count({
      where: {
        statusId: confirmedStatus.id
      }
    });
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const data = await ApplicationReceive.findAll({
      where: {
        supplierId: null,
        statusId: confirmedStatus.id
      },
      order: orderStatement,
      limit,
      offset,
      include: [
        { model: Statuses },
        { model: Categories },
        { model: Properties },
        { model: Things },
        { model: Users, as: "ApplicationReceiveUser" },
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

const deliveredReceives = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;
  
  try {
    const orderStatement = order(sorts);

    const deliveredStatus = await Statuses.findOne({
      where: {
        code: 'delivered'
      }
    });
    
    const count = await ApplicationReceive.count({
      where: {
        statusId: deliveredStatus.id
      }
    });
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const data = await ApplicationReceive.findAll({
      where: {
        supplierId: req.userData.userId,
        statusId: deliveredStatus.id
      },
      order: orderStatement,
      limit,
      offset,
      include: [
        { model: Statuses },
        { model: Categories },
        { model: Properties },
        { model: Things },
        { model: Users, as: "ApplicationReceiveUser" },
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

const setInTheWayAppReceive = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await ApplicationReceive.findOne({
      where: {
        id
      }
    });

    if (!data) throw new ResponseException("Application Recieve not found", 400);

    const inTheWayStatus = await Statuses.findOne({
      where: {
        code: 'in_the_way'
      }
    });

    data.statusId = inTheWayStatus.id
    data.supplierId = req.userData.userId

    await data.save();

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

const setDeliveredAppReceive = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await ApplicationReceive.findOne({
      where: {
        id,
        supplierId: req.userData.userId
      }
    });

    if (!data) throw new ResponseException("Application Recieve not found", 400);

    const deliveredStatus = await Statuses.findOne({
      where: {
        code: 'delivered'
      }
    });

    data.statusId = deliveredStatus.id

    await data.save();

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------

const allTransfers = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;
  
  try {
    const orderStatement = order(sorts);
    
    const count = await ApplicationTransfer.count({
      where: {
        supplierId: req.userData.userId
      }
    });
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const inTheWayStatus = await Statuses.findOne({
      where: {
        code: 'in_the_way'
      }
    });

    const data = await ApplicationTransfer.findAll({
      where: {
        supplierId: req.userData.userId,
        statusId: inTheWayStatus.id
      },
      order: orderStatement,
      limit,
      offset,
      include: [
        { model: Uploads },
        { model: Users, as: "ApplicationTransferUser" },
        { model: Statuses }
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

const confirmedTransfers = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;
  
  try {
    const orderStatement = order(sorts);

    const confirmedStatus = await Statuses.findOne({
      where: {
        code: 'confirmed'
      }
    });
    
    const count = await ApplicationTransfer.count({
      where: {
        statusId: confirmedStatus.id
      }
    });
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const data = await ApplicationTransfer.findAll({
      where: {
        supplierId: null,
        statusId: confirmedStatus.id
      },
      order: orderStatement,
      limit,
      offset,
      include: [
        { model: Uploads },
        { model: Users, as: "ApplicationTransferUser" },
        { model: Statuses }
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

const setInTheWayAppTransfer = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await ApplicationTransfer.findOne({
      where: {
        id
      }
    });

    if (!data) throw new ResponseException("Application Transfer not found", 400);

    const inTheWayStatus = await Statuses.findOne({
      where: {
        code: 'in_the_way'
      }
    });

    data.statusId = inTheWayStatus.id
    data.supplierId = req.userData.userId

    await data.save();

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

const setDeliveredAppTransfer = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await ApplicationTransfer.findOne({
      where: {
        id,
        supplierId: req.userData.userId
      }
    });

    if (!data) throw new ResponseException("Application Transfer not found", 400);

    const deliveredStatus = await Statuses.findOne({
      where: {
        code: 'delivered'
      }
    });

    data.statusId = deliveredStatus.id

    await data.save();

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
};

const deliveredAppTransfer = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;

  try {
    const orderStatement = order(sorts);

    const deliveredStatus = await Statuses.findOne({
      where: {
        code: 'delivered'
      }
    });
    
    const count = await ApplicationTransfer.count({
      where: {
        statusId: deliveredStatus.id
      }
    });
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const data = await ApplicationTransfer.findAll({
      where: {
        supplierId: req.userData.userId,
        statusId: deliveredStatus.id
      },
      order: orderStatement,
      limit,
      offset,
      include: [
        { model: Uploads },
        { model: Users, as: "ApplicationTransferUser" },
        { model: Statuses }
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

router.get('/app-receives', isRole(['supplier']), allReceives);
router.get('/app-receives/delivered', isRole(['supplier']), deliveredReceives);
router.get('/app-receives/confirmed', isRole(['supplier']), confirmedReceives);
router.put('/app-receives/:id/in-the-way', isRole(['supplier']), setInTheWayAppReceive);
router.put('/app-receives/:id/delivered', isRole(['supplier']), setDeliveredAppReceive);

// -------------------------------------------------------

router.get('/app-transfers', isRole(['supplier']), allTransfers);
router.get('/app-transfers/delivered', isRole(['supplier']), deliveredAppTransfer);
router.get('/app-transfers/confirmed', isRole(['supplier']), confirmedTransfers);
router.put('/app-transfers/:id/in-the-way', isRole(['supplier']), setInTheWayAppTransfer);
router.put('/app-transfers/:id/delivered', isRole(['supplier']), setDeliveredAppTransfer);

module.exports = router;