const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

router.get('/', async (req, res, next) => {
  try {
    res.render('index', { active: 'home' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
