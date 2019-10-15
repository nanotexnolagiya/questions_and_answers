const express = require('express')
const router = express.Router()
const { Roles } = require('../models')

const all = async (req, res) => {
  const { limit, page = 1 } = req.query;
  try {
    const count = await Roles.count();
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const roles = await Roles.findAll({
      limit,
      offset
    });

    res.status(200).json({
      ok: true,
      data: roles,
      pageCount: pages
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: error.message
    });
  }
}

router.get('/', all);


module.exports = router;