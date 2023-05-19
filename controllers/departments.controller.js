const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

router.get('/departments', async (req, res, next) => {
  try {
    const departments = await prisma.Department.findMany({}) 
    res.render('departments/index',{departments : departments, active: req.active})
  } catch (error) {
    next(error)
  }
})

router.post('/departments/delete/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const flag = await prisma.Department.delete({where:{id:id}}) 
    res.redirect('/departments')
  } catch (error) {
    next(error)
  }
})

router.get('/departments/Show_Subjects/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const Subjects = await prisma.Subject.findMany({where:{departmentId:id}}) 
    res.render('departments/Show_Subjects',{Subjects : Subjects, active: req.active})
  } catch (error) {
    next(error)
  }
})

router.get('/departments/Show_Students/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const Students = await prisma.User.findMany({where:{departmentId:id , isStudent:true}})
    const department =await prisma.Department.findMany({where:{id:id}});
    res.render('departments/Show_Students',{Students : Students,department:department[0], active: req.active})
  } catch (error) {
    next(error)
  }
})

router.get('/department/Insert', async (req, res, next) => {
  try {
    res.render('departments/Insert_department',{active: req.active})
  } catch (error) {
    next(error)
  }
})

router.post('/department/Insert', async (req, res, next) => {
  try {
    const department= await prisma.department.create({
      data :{
        name:req.body.name,
        code:req.body.code
      }
    })
    res.redirect('/departments')
  } catch (error) {
    next(error)
  }
})

router.get('/departments/Update/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const department = await prisma.Department.findFirst({where:{id:id}}) 
    res.render('departments/Update_department',{department:department,active: req.active})
  } catch (error) {
    next(error)
  }
})
router.post('/departments/Update/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const department = await prisma.Department.update({data:{name:req.body.name,code:req.body.code},where:{id:id}}) 
    res.redirect('/departments')
  } catch (error) {
    next(error)
  }
})


module.exports = router
