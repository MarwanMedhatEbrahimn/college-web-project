const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')
const bcrypt = require('bcrypt')
const saltRounds = 10
 
router.get('/subjects', async (req, res, next) => {
  try {
    const subjects = await prisma.Subject.findMany({
      include: {
        department: true,
        User: true
      }
    })
    res.render('subjects/index', { subjects: subjects, active: req.active })
  } catch (error) {
    next(error)
  }
})
 
router.get('/subjects/add', async (req, res) => {
  try {
    res.render('subjects/create', { active: req.active })
  } catch (error) {
    next(error)
  }
})
 
router.post('/subjects/create', async (req, res, next) => {
  try {
    let { name,code,departmentId } = req.body
    let hashed = await bcrypt.hash(password, saltRounds)
    let subject = {
      name,
      code,
      departmentId
    }
 
    await prisma.Subject.create({ data: { ...subject } })
    res.redirect('/subjects')
  } catch (error) {
    console.log(error)
    next(error)
  }
})
 
router.post('/subjects/update/:id', async (req, res, next) => {
  try {
    let subjectId = Number(req.params.id)
    let { name,code,departmentId } = req.body
    let subject = {
      name,
      code,
      departmentId
    }
    await prisma.Subject.update({ data: { ...subject }, where: {id: userId} })
    res.redirect('subjects/index')
  } catch (error) {
    console.log(error)
    next(error)
  }
})
 
router.get('/subjects/edit/:id', async (req, res) => {
  try {
    const subject= await prisma.Subject.findFirst({
      where: {
        id: Number(req.params.id)
      }
    })
    res.render('subjects/edit', { active: req.active, subject: subject })
  } catch (error) {
    next(error)
  }
})
 
router.post('/subjects/delete/:id', async (req, res, next) => {
  try {
    const subject = await prisma.subject.delete({
      where: {
        id: Number(req.params.id)
      }
    })
    res.redirect('/subjects')
  } catch (error) {
    next(error)
  }
})
 
 
module.exports = router
