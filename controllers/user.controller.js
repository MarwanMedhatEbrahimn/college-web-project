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
router.get('/doctors/modify/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    const sub = await prisma.Subject.findMany({
      where: { userId: id }
    })
    res.render('users/modifyassign', { sub: sub, active: req.active })
  } catch (error) {
    next(error)
  }
})
router.post('/doctors/modify/:us/:id', async (req, res, next) => {
  try {
    const iD = parseInt(req.params.id)
    const user = parseInt(req.params.us)

      await prisma.Subject.update({
      where: { id: iD },
      data:{userId: null}
    })

    const sub2 = await prisma.Subject.findMany({
      where: { userId: user }
    })
    res.render('users/modifyassign', { sub: sub2, active: req.active })
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
router.post('/doctors/:id', async (req, res, next) => {
  let subj = req.body['my-dropdown']
  const id = parseInt(req.params.id)

  try {
    const sub = await prisma.Subject.findFirst({
      where: { name: subj }
    })

    const u = await prisma.Subject.update({
      where: { id: sub.id },
      data: {
        userId: id
      }
    })

    const users = await prisma.user.findMany()
    const subjects = await prisma.Subject.findMany({
      where:{
        userId:null
      }
    })

    res.render('users/admindoctor', {
      users: users,
      subjects: subjects,
      active: req.active
    })
  } catch (error) {
    next(error)
  }
})
router.get('/doctors', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany()

    const subjects = await prisma.Subject.findMany({
      where:{
        userId:null
      }
    })
    res.render('users/admindoctor', {
      users: users,
      subjects: subjects,
      active: req.active
    })
  } catch (error) {
    next(error)
  }
})
module.exports = router
