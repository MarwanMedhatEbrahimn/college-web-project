const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

router.get('/subjects', async (req, res, next) => {
  try {
  /*  const user = await prisma.user.create({
      data: {
        email: 'joh.doe@example.com',
        name: 'John',
        academicNumber:'777',
        isDoctor:true,
        subject:{create: [
          {
          name:"mnm",
          departmentId:3
        }]}
       
      },
    })
  
   // console.log(user)*/
  
    const subjects = await prisma.user.findMany()
   // console.log(subjects.subject)
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
