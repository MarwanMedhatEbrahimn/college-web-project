const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany()
    res.render('index', { users: users })
  } catch (error) {
    next(error)
  }
})

router.post('/users', async (req, res, next) => {
  try {
    console.log(req.body)
    res.json('sent')
  } catch (error) {
    next(error)
  }
})

module.exports = router
