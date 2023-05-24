const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')
const { getUserType, mapUserType } = require('../utils/user_types')
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        subjects: true,
        department: true
      }
    })
    users.forEach((user) => {
      user.type = getUserType(user)
    })
    res.render('users/index', { users: users, active: req.active })
  } catch (error) {
    next(error)
  }
})

router.get('/users/add', async (req, res) => {
  try {
    res.render('users/create', { active: req.active })
  } catch (error) {
    next(error)
  }
})

router.post('/users/create', async (req, res, next) => {
  try {
    let { academic_number, name, email, password, type } = req.body
    let hashed = await bcrypt.hash(password, saltRounds)
    let user = {
      academicNumber: academic_number,
      name,
      email,
      password: hashed
    }
    user = mapUserType(user, type)
     
    await prisma.user.create({ data: { ...user } })
    res.redirect('/users')
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('/users/update/:id', async (req, res, next) => {
  try {
    let userId = Number(req.params.id)
    let { academic_number, name, email, new_password, type } = req.body
    let user = {
      academicNumber: academic_number,
      name,
      email,
    }
    if(new_password != "") {
      let hashed = await bcrypt.hash(new_password, saltRounds)
      user.password = hashed
    }
    user = mapUserType(user, type)
    await prisma.user.update({ data: { ...user }, where: {id: userId} })
    res.redirect('/users/' + userId)
  } catch (error) {
    console.log(error)
    next(error)
  }
})



router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(req.params.id)
      },
      include: {
        subjects: true,
        department: true
      }
    })
    const succeeded = await prisma.stateOFsub.findMany({
      where:{
        user_Id: Number(req.params.id),
        state: "succeeded"
      },
      include: {
        subject: {
          select :{name:true, code:true,department:true}
        }
      }
    })
    const failure = await prisma.stateOFsub.findMany({
      where:{
        user_Id: Number(req.params.id),
        state: "failure"
      },
      include: {
        subject: {
          select :{name:true, code:true,department:true}
        }
      }
      
    })
    const registered = await prisma.stateOFsub.findMany({
      where:{
        user_Id: Number(req.params.id),
        state: "registered"
      },
      include: {
        subject: {
          select :{name:true, code:true,department:true}
        }
      }
    })
    user.type = getUserType(user)
    res.render('users/show', { active: req.active, user: user, registered: registered, succeeded: succeeded, failure: failure })
  } catch (error) {
    console.log(error)
    next(error)
  }
})


router.get('/users/edit/:id', async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(req.params.id)
      }
    })
    user.type = getUserType(user)
    res.render('users/edit', { active: req.active, user: user })
  } catch (error) {
    next(error)
  }
})

router.post('/users/delete/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: Number(req.params.id)
      }
    })
    res.redirect('/users')
  } catch (error) {
    next(error)
  }
})

router.get('/users/Show_Subject/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const subjects = await prisma.user.findFirst({
      where: {
        id: id
      },
      select: {
        subjects: true
      }
    })
    res.render('users/Show_Subjects', {
      subjects: subjects.subject,
      active: req.active
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
