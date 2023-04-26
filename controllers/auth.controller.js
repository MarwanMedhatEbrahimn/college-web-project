const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

router.get('/login', async (req, res, next) => {
  try {
    res.render('pages/login', { active: req.active })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    console.log(req.body)
    res.json('sent')
  } catch (error) {
    next(error)
  }
})

module.exports = router
