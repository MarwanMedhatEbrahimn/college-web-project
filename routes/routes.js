const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home.controller')
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/user.controller')
const subjectController = require('../controllers/subject.controller')
const depertmentController = require('../controllers/departments.controller')
const middlewares = require('../middlewares/auth')
const adminR = require('./adminRouter')
let { checkSignIn,  } = middlewares

router.use(authController)
router.use('/admin', checkSignIn, adminR)
router.use(homeController, checkSignIn)
router.use(userController, checkSignIn)
router.use(subjectController, checkSignIn)
router.use(depertmentController)
router.get('*', function (req, res) {
  res.redirect('/')
})

module.exports = router
