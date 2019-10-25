const express = require('express')
const router = express.Router()
const { Statuses } = require('../models')

const all = async (req, res, next) => {
  const { limit, page = 1 } = req.query;
  try {
    const count = await Statuses.count();
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const statuses = await Statuses.findAll({
      limit,
      offset
    });

    res.status(200).json({
      ok: true,
      data: statuses,
      pageCount: pages
    });
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  const { name } = req.body;
  const id = req.params.id;

  try {
    const status = await Statuses.findOne({
      where: {
        id
      }
    });

    if (name) status.name = name
    
    await status.save();

    res.status(202).json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
}

router.get('/', all);
router.put('/:id', update)

module.exports = router;