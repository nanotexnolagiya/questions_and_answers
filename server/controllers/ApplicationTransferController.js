const express = require('express')
const router = express.Router()
const {
  ApplicationTransfer,
  Uploads,
  Users,
  Statuses
} = require("../models");

const all = async (req, res) => {
  const { limit, page = 1 } = req.query;
  try {
    const count = await ApplicationTransfer.count();
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const data = await ApplicationTransfer.findAll({
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
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

const single = async (req, res) => {
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

    if (!data) throw new Error("Application Transfer not found");

    res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

const add = async (req, res) => {
  const { text, upload_ids = [] } = req.body;

  try {
    const status = await Statuses.findOne({
      where: {
        code: "expects"
      }
    });

    if (!status) throw new Error("Status not found");

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
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

const update = async (req, res) => {
  const { text, upload_ids = [] } = req.body;
  const id = req.params.id;

  try {
    const status = await Statuses.findOne({
      where: {
        code: "expects"
      }
    });

    if (!status) throw new Error("Status not found");

    const data = await ApplicationTransfer.findOne({
      where: {
        id
      }
    });

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

const remove = async (req, res) => {
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
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

router.get('/', all);
router.get('/:id', single);
router.put('/:id', update);
router.post('/', add);
router.delete('/:id', remove);


module.exports = router;