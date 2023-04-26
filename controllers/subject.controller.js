const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

router.get('/subjects', async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany()
    res.render('subjects/index', { subjects: subjects, active: req.active })
  } catch (error) {
    next(error)
  }
})

router.post('/subjects', async (req, res, next) => {
  try {
    console.log(req.body)
    res.json('sent')
  } catch (error) {
    next(error)
  }
})

module.exports = router
