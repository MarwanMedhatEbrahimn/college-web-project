const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')
const { getUserType, mapUserType } = require('../utils/user_types')
const bcrypt = require('bcrypt')
const saltRounds = 10
 
router.get('/subject', async (req, res, next) => {
  try {
    const subject = await prisma.Subject.findMany({
      include: {
        department: true,
        user: true
      }
    })
    res.render('subject/index', { subject: subject, active: req.active })
  } catch (error) {
    next(error)
  }
})
 
router.get('/subject/add', async (req, res) => {
  try {
    res.render('subject/create', { active: req.active })
  } catch (error) {
    next(error)
  }
})
 
router.post('/subject/create', async (req, res, next) => {
  try {
    let { name,code,departmentId } = req.body
    let hashed = await bcrypt.hash(password, saltRounds)
    let subject = {
      name,
      code,
      departmentId
    }
 
    await prisma.Subject.create({ data: { ...subject } })
    res.redirect('/subject')
  } catch (error) {
    console.log(error)
    next(error)
  }
})
 
router.post('/subject/update/:id', async (req, res, next) => {
  try {
    let subjectId = Number(req.params.id)
    let { name,code,departmentId } = req.body
    let subject = {
      name,
      code,
      departmentId
    }
    await prisma.Subject.update({ data: { ...subject }, where: {id: userId} })
    res.redirect('subject/index')
  } catch (error) {
    console.log(error)
    next(error)
  }
})
 
router.get('/subject/edit/:id', async (req, res) => {
  try {
    const subject= await prisma.Subject.findFirst({
      where: {
        id: Number(req.params.id)
      }
    })
    res.render('users/edit', { active: req.active, subject: subject })
  } catch (error) {
    next(error)
  }
})
 
router.post('/subject/delete/:id', async (req, res, next) => {
  try {
    const subject = await prisma.subject.delete({
      where: {
        id: Number(req.params.id)
      }
    })
    res.redirect('/subject')
  } catch (error) {
    next(error)
  }
})
 
router.get('/subject/delete/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    await prisma.User.delete({ where: { id: id } })
    res.redirect('/subject')
  } catch (error) {
    next(error)
  }
})
 
module.exports = router
