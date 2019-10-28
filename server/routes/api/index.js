const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const {
  AuthController,
  ApplicationTransferController,
  ApplicationReceiveController,
  UploadController,
  CategoryController,
  PropertyController,
  ThingController,
  UserController,
  RoleController,
  StatusController
  // SupplierController
} = require('../../controllers')

router.use('/auth', AuthController)

router.use(checkAuth)

router.use('/app-transfers', ApplicationTransferController)
router.use('/uploads', UploadController)
router.use('/app-receives', ApplicationReceiveController)
router.use('/categories', CategoryController)
router.use('/properties', PropertyController)
router.use('/users', UserController)
router.use('/roles', RoleController)
router.use('/statuses', StatusController)
router.use('/things', ThingController)

module.exports = router
