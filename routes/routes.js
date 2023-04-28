const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home.controller')
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/user.controller')
const subjectController = require('../controllers/subject.controller')
const adminR = require('./adminRouter')
router.use('/admin', adminR)
router.use(homeController)
router.use(authController)
router.use(userController)
router.use(subjectController)
router.get('*', function (req, res) {
  res.redirect('/')
})

module.exports = router
