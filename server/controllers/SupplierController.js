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

router.get('/app-receives')
router.get('/app-receives/confirmed')
router.put('/app-receives')