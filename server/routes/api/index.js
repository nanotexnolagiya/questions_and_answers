const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const isRole = require('../middleware/isRole')
const {
  AuthController,
  // InStatementController,
  // OutStatementController,
  // UploadController,
  CategoryController,
  // PropertyController,
  // ThingController,
  // StatusController,
  UserController,
  RoleController,
  // SupplierController
} = require('../../controllers')

router.use('/auth', AuthController)

router.use(checkAuth)

// router.use('/app-transfers')
// router.use('/uploads')
// router.use('/app-recevies')
router.use('/categories', CategoryController)
// router.use('/properties')
router.use('/users', UserController)
router.use('/roles', RoleController)
// router.use('/statuses')
// router.use('/things')

/*
 * *********************************************************************************
 * In Statements Routes ************************************************************
 * *********************************************************************************
 */
// Hamma takliflarni olish
// router.get('/in-statements', isRole('admin'), InStatementController.all)
// // Taklif qo'shish
// router.post(
//   '/in-statements',
//   isRole(['admin', 'user', 'supplier']),
//   InStatementController.add
// )
// // Bitta taklifni id bo'yicha olish
// router.get('/in-statements/:id', isRole('admin'), InStatementController.single)
// // Bitta taklifni id bo'yicha o'zgartirish
// router.put('/in-statements/:id', isRole('admin'), InStatementController.update)
// // Bitta taklifni id bo'yicha o'chirish
// router.delete(
//   '/in-statements/:id',
//   isRole('admin'),
//   InStatementController.delete
// )
// // Foydalanuvchiga tegishli takliflarni olish
// router.get('/in-statements/user', isRole('user'), InStatementController.userAll)
// // Yetkazib beruvchi qabul qilgan takliflarni olish
// router.get(
//   '/in-statements/supplier',
//   isRole('supplier'),
//   InStatementController.supplierAll
// )
// // Yetkazib berilishi kerak bo'lgan takliflarni olish
// router.get(
//   '/in-statements/status/delivery',
//   isRole('supplier'),
//   InStatementController.delivery
// )
// // Yetkazilishi kerak bo'lgan taklifni yetkazadigan yetkazib beruvchini belgilash
// router.put(
//   '/in-statements/:id/way',
//   isRole('supplier'),
//   InStatementController.way
// )
// // Faydalunivchining taklifini id orqali o'chirish
// router.delete(
//   '/in-statements/:id/user',
//   isRole('user'),
//   InStatementController.userDelete
// )

// /*
//  * *********************************************************************************
//  * Upload Routes *******************************************************************
//  * *********************************************************************************
//  */
// router.get('/uploads/:id', isRole('admin'), UploadController.single)
// router.get('/uploads', isRole('admin'), UploadController.all)
// router.post('/uploads', UploadController.anyUpload, UploadController.add)

// /*
//  * *********************************************************************************
//  * Categories Routes ***************************************************************
//  * *********************************************************************************
//  */
// // Hamma kategoriyalarni olish
// router.get('/categories', CategoryController.all)
// // Hamma kategoriyalarni darahsimon shaklda olish
// router.get('/categories/tree', CategoryController.tree)
// // Kategoriya qo'shish
// router.post('/categories', isRole('admin'), CategoryController.add)
// // Kategoriyaga tegishli kategoriyalarni id orqali olish
// router.get('/categories/:id', CategoryController.single)
// // Kategoriyaga tegishli kategoriyalarni olish
// router.get('/categories/:id/children', CategoryController.children)
// // Kategoriyaga tegishli kategoriyalarni daraht shaklida olish
// router.get('/categories/:id/children/tree', CategoryController.childrenTree)
// // Kategoriyaga tegishli buyumlarni olish
// router.get('/categories/:id/things', isRole('admin'), CategoryController.things)
// // Kategoriyaga tegishli xususiyatlarni olish
// router.get('/categories/:id/properties', CategoryController.properties)
// // Kategoriyaga tegishli xususiyatlarni qo'shish
// router.post(
//   '/categories/:id/properties',
//   isRole('admin'),
//   CategoryController.addProps
// )
// // Kategoriyaga tegishli xususiyatlarni yangilash
// router.put(
//   '/categories/:id/properties',
//   isRole('admin'),
//   CategoryController.updateProps
// )
// // Kategoriyani id bo'yicha yangilash
// router.put('/categories/:id', isRole('admin'), CategoryController.update)
// // Kategoriyani id bo'yicha o'chirish
// router.delete('/categories/:id', isRole('admin'), CategoryController.delete)

// /*
//  * *********************************************************************************
//  * Properties Routes ***************************************************************
//  * *********************************************************************************
//  */
// // Barcha xususiyatlarni olish
// router.get('/properties', isRole('admin'), PropertyController.all)
// // Xususiyat qo'shish
// router.post('/properties', isRole('admin'), PropertyController.add)
// // Xususiyatni id orqali olish
// router.get('/properties/:id', isRole('admin'), PropertyController.single)
// // Xususiyatni id orqali yangilash
// router.put('/properties/:id', isRole('admin'), PropertyController.update)
// // Xususiyatni id orqali o'chirish
// router.delete('/properties/:id', isRole('admin'), PropertyController.delete)

// /*
//  * *********************************************************************************
//  * Property Values Routes **********************************************************
//  * *********************************************************************************
//  */
// // Xususiyatning barcha qiymatlarini olish
// router.get('/properties/:id/values', isRole('admin'), PropertyController.values)
// // Xususiyatga qiymat qo'shish
// router.post(
//   '/properties/:id/values',
//   isRole('admin'),
//   PropertyController.valueAdd
// )
// // Xususiyatning qiymatini id orqali olish
// router.get(
//   '/properties/:id/values/:valueId',
//   isRole('admin'),
//   PropertyController.valueSingle
// )
// // Xususiyatning qiymatini yangilash
// router.put(
//   '/properties/:id/values/:valueId',
//   isRole('admin'),
//   PropertyController.valueUpdate
// )
// // Xususiyatning qiymatini o'chirish
// router.delete(
//   '/properties/:id/values/:valueId',
//   isRole('admin'),
//   PropertyController.valueDelete
// )

// /*
//  * *********************************************************************************
//  * Things Routes *******************************************************************
//  * *********************************************************************************
//  */
// // Barcha buyumlarni olish
// router.get('/things', isRole('admin'), ThingController.all)
// // Buyum qo'shish
// router.post('/things', isRole('admin'), ThingController.add)
// // Buyumni id orqali tanlash
// router.get('/things/:id', isRole('admin'), ThingController.single)
// // Buyumni id orqali o'zgartirish
// router.put('/things/:id', isRole('admin'), ThingController.update)
// // Buyumni id orqali o'chirish
// router.delete('/things/:id', isRole('admin'), ThingController.delete)

// /*
//  * *********************************************************************************
//  * Out Statements Routes ***********************************************************
//  * *********************************************************************************
//  */
// // Barcha talablarni olish
// router.get('/out-statements', isRole('admin'), OutStatementController.all)
// // Talab qo'shish
// router.post('/out-statements', OutStatementController.add)
// // Talabni id orqali olish
// router.get('/out-statements/:id', OutStatementController.single)
// // Talabni id orqali yangilash
// router.put('/out-statements/:id', OutStatementController.update)
// // Talabni id orqali o'chirish
// router.delete(
//   '/out-statements/:id',
//   isRole('admin'),
//   OutStatementController.delete
// )
// // Faydalunuvchini barcha talablarini olish
// router.get('/out-statements/user'), OutStatementController.userAll
// // Yetkazib beruvchini barcha talablarini olish
// router.get('/out-statements/supplier'), OutStatementController.supplierAll
// // "delivery" statusli talabni olish
// router.get('/out-statements/status/delivery', OutStatementController.delivery)
// // Faydalunuvchiga tegishli talabni o'chirish
// router.delete('/out-statements/:id/user', OutStatementController.userDelete)

// /*
//  * *********************************************************************************
//  * Status Routes *******************************************************************
//  * *********************************************************************************
//  */
// // Barcha statuslarni olish
// router.get('/statuses', isRole('admin'), StatusController.all)
// // Statusni qo'shish
// router.post('/statuses', isRole('admin'), StatusController.add)
// // Statusni id orqali olish
// router.get('/statuses/:id', isRole('admin'), StatusController.single)
// // Statusni id orqali yangilash
// router.put('/statuses/:id', isRole('admin'), StatusController.update)
// // Statusni id orqali o'chirish
// router.delete('/statuses/:id', isRole('admin'), StatusController.delete)

// /*
//  * *********************************************************************************
//  * Users Routes ********************************************************************
//  * *********************************************************************************
//  */
// // Barcha foydalanuvchilarni olish
// router.get('/users', isRole('admin'), UserController.all)
// // Foydalanuvchini takliflarini olish
// router.get(
//   '/users/:id/in-statements',
//   isRole('admin'),
//   UserController.inStatements
// )
// // Foydalanuvchini talablarini olish
// router.get(
//   '/users/:id/out-statements',
//   isRole('admin'),
//   UserController.outStatements
// )
// // Foydalanuvchini id orqali olish
// router.get('/users/:id', isAdminOrCurrUser, UserController.single)
// // Foydalanuvchini id orqali yangilash
// router.put('/users/:id', isAdminOrCurrUser, UserController.update)
// // Foydalanuvchini id orqali o'chirish
// router.delete('/users/:id', isAdminOrCurrUser, UserController.delete)

// /*
//  * *********************************************************************************
//  * Suppliers Routes ****************************************************************
//  * *********************************************************************************
//  */
// // Barcha etkazib beruvchilarni olish
// router.get('/suppliers', isRole('admin'), SupplierController.all)
// // Yetkazib beruvchini barcha takliflarini olish
// router.get(
//   '/suppliers/:id/in-statements',
//   isRole('admin'),
//   SupplierController.inStatements
// )
// // Yetkazib beruvchini barcha talablarini olish
// router.get(
//   '/suppliers/:id/out-statements',
//   isRole('admin'),
//   SupplierController.outStatements
// )
// // Yetkazib beruvchini id orqali olish
// router.get('/suppliers/:id', isAdminOrCurrUser, SupplierController.single)
// // Yetkazib beruvchini id orqali yangilash
// router.put('/suppliers/:id', isAdminOrCurrUser, SupplierController.update)
// // Yetkazib beruvchini id orqali o'chirish
// router.delete('/suppliers/:id', isAdminOrCurrUser, SupplierController.delete)

module.exports = router
