const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

// Subjects page - GET
router.get('/subjects', async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany()
    res.render('subjects/index', { subjects: subjects, active: req.active })
  } catch (error) {
    next(error)
  }
})

// Insert subject page - GET
router.get('/subjects/Insert', async (req, res, next) => {
  try {
    res.render('subjects/insert_subject', { active: req.active })
  } catch (error) {
    next(error)
  }
})
// Insert subject request - POST
router.post('/subjects/Insert', async (req, res, next) => {
  try {
    const subject = await prisma.subject.create({
      data: {
        name: req.body.name,
        code: req.body.code
      }
    })
    res.redirect('/subjects')
  } catch (error) {
    next(error)
  }
})

// Update subject page - GET
router.get('/subjects/Update/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const subject = await prisma.Subject.findFirst({ where: { id: id } })
    res.render('subjects/update_subject', {
      subject: subject,
      active: req.active
    })
  } catch (error) {
    next(error)
  }
})
// Update subject request - POST
router.post('/subjects/Update/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const subject = await prisma.Subject.update({
      data: { name: req.body.name, code: req.body.code },
      where: { id: id }
    })
    res.redirect('/subjects')
  } catch (error) {
    next(error)
  }
})

// Delete subject request - POST
router.post('/subjects/delete/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const flag = await prisma.Subject.delete({ where: { id: id } })
    res.redirect('/subjects')
  } catch (error) {
    next(error)
  }
})

// Subject's students page - GET
router.get('/subjects/Show_Students/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const Students = await prisma.User.findMany({
      where: {
        subjects: {
          some: {
            id: id
          }
        },
        isStudent: true
      }
    })
    const department = await prisma.Department.findMany({
      where: {
        Subject: {
          some: {
            id: id
          }
        }
      }
    })
    res.render('subjects/show_Students', {
      Students: Students,
      department: department[0],
      active: req.active
    })
  } catch (error) {
    next(error)
  }

  // Subject's departments page - GET
  router.get('/subjects/Show_Departments/:id', async (req, res, next) => {
    try {
      const id = parseInt(req.params.id)
      const Departments = await prisma.Department.findMany({
          where: {
            Subject: {
              some: {
                id: id
              }
            }
          }
        }
      )
      res.render('subjects/show_Departments', {
        Departments: Departments,
        active: req.active
      })
    } catch (error) {
      next(error)
    }
  })
})

module.exports = router
