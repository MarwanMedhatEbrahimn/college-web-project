const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({include: {
      Department: true,
    }})
    res.render('users/index', { users: users, active: req.active })
  } catch (error) {
    next(error)
  }
})

router.get('/users/Show_Subject/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const subjects = await prisma.user.findFirst({where: {
      id: id,
    },
    select:{
      subject:true
    }
  })
  res.render('users/Show_Subjects', { subjects: subjects.subject, active: req.active })
  } catch (error) {
    next(error)
  }
})

router.get('/users/delete/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const flag = await prisma.User.delete({where:{id:id}}) 
    res.redirect('/users')
  } catch (error) {
    next(error)
  }
})



module.exports = router
