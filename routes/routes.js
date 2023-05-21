const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home.controller')
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/user.controller')
const subjectController = require('../controllers/subject.controller')
const depertmentController = require('../controllers/departments.controller')
const doctorController = require('../controllers/Doctor.controller')
const StudentController= require("../controllers/student.controller")
const middlewares = require('../middlewares/auth')
const adminR = require('./adminRouter')
let {checkSignInAsAdmin , checkSignInAsDoctor, checkSignInAsStudent, checkSign} = middlewares


router.use(authController)
router.use(homeController, checkSign)
router.use('/admin', checkSign, adminR)
router.use(userController, checkSign)
router.use(subjectController, checkSign)
router.use(depertmentController, checkSign)
router.use(doctorController, checkSign)
router.use(StudentController, checkSign)
router.get('*', function (req, res) {
  res.redirect('/')
})

module.exports = router
