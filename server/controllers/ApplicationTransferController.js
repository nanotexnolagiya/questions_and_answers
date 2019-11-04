const express = require('express')
const router = express.Router()
const {
  ApplicationTransfer,
  Uploads,
  Users,
  Statuses
} = require("../models");
const filter = require('../utils/filter');
const order = require('../utils/order');


const all = async (req, res, next) => {
  const { limit, page = 1, sorts } = req.query;

  const columnsFilter = [
    'id',
    'text',
    'statusId'
  ];
  
  try {
    const whereStatement = filter(req.query, columnsFilter);
    const orderStatement = order(sorts);
    
    const count = await ApplicationTransfer.count();
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const data = await ApplicationTransfer.findAll({
      where: whereStatement,
      order: orderStatement,
      limit,
      offset,
      include: [
        { model: Uploads },
        { model: Users, as: "ApplicationTransferUser" },
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

const single = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await ApplicationTransfer.findOne({
      where: {
        id
      },
      include: [
        { model: Uploads },
        { model: Users, as: "ApplicationTransferUser" },
        { model: Users, as: "ApplicationTransferSupplier" },
        { model: Statuses }
      ]
    });

    if (!data) throw new ResponseException("Application Transfer not found", 400);

    res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    next(error)
  }
};

const add = async (req, res, next) => {
  const { text, upload_ids = [], statusId } = req.body;

  try {
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

    if (!status) throw new ResponseException("Status not found");

    const data = await ApplicationTransfer.create({
      userId: req.userData.userId,
      text,
      statusId:status.id
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

const update = async (req, res, next) => {
  const { text, upload_ids = [], statusId } = req.body;
  const id = req.params.id;

  try {
    if (!statusId) throw new ResponseException('Status not found');

    const status = await Statuses.findOne({
      where: {
        id: statusId
      }
    });

    if (!status) throw new ResponseException("Status not found");

    const data = await ApplicationTransfer.findOne({
      where: {
        id
      }
    });

    if (text) data.text = text
    data.statusId = status.id

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

const remove = async (req, res, next) => {
  const id = req.params.id;

  try {
    const data = await ApplicationTransfer.destroy({
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