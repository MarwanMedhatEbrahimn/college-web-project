const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany()
    res.render('users/index', { users: users, active: req.active })
  } catch (error) {
    next(error)
  }
})

module.exports = router
