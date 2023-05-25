const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')
const { getUserType, mapUserType } = require('../utils/user_types')
const bcrypt = require('bcrypt')
const saltRounds = 10
const {isAdmin} = require("../middlewares/auth")

async function search (name){
  const users = await prisma.user.findMany({
    where:{
      name:{
        contains:name
      }
    },
    include: {
      subjects: true,
      department: true
    }
  })
  users.forEach((user) => {
    user.type = getUserType(user)
  })
  return users
}

router.post('/search',isAdmin,async (req,res)=>{
  try {
    const users = await search(req.body.name)
    res.set('Access-Control-Allow-Origin', '*');
    return res.json({ users: users })

  } catch (error) {
    return res.json({ users:{} })
  }

});

router.get('/users',isAdmin, async (req, res, next) => {
  try {
    const users = await search("")
    res.render('users/index', { users: users, active: req.active })
  } catch (error) {
    next(error)
  }
})

router.get('/users/add',isAdmin, async (req, res) => {
  try {
    const Departments = await prisma.Department.findMany()
    res.render('users/create', { Departments:Departments, active: req.active })
  } catch (error) {
    next(error)
  }
})

router.post('/users/create',isAdmin, async (req, res, next) => {
  try {
    let { academic_number, name, email, password, type, departmentId } = req.body
    let hashed = await bcrypt.hash(password, saltRounds)
    let user = {
      academicNumber: academic_number,
      name,
      email,
      password: hashed,
      departmentId: Number(departmentId)
    }
    user = mapUserType(user, type)
     
    await prisma.user.create({ data: { ...user } })
    res.redirect('/users')
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('/users/update/:id',isAdmin, async (req, res, next) => {
  try {
    let userId = Number(req.params.id)
    let { academic_number, name, email, new_password, type, departmentId } = req.body
    console.log(departmentId)
    let user = {
      academicNumber: academic_number,
      name,
      email,
      departmentId: Number(departmentId)
    }
    if(new_password != "") {
      let hashed = await bcrypt.hash(new_password, saltRounds)
      user.password = hashed
    }
    user = mapUserType(user, type)
    await prisma.user.update({ data: { 
      name: user.name,
      academicNumber: user.academicNumber,
      email: user.email,
      departmentId: user.departmentId

     }, where: {id: userId} })
    res.redirect('/users')
  } catch (error) {
    console.log(error)
    next(error)
  }
})
router.get('/users/:id',isAdmin, async (req, res) => {
  try {
    const userView = await prisma.user.findFirst({
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
    userView.type = getUserType(userView)
    res.render('users/show', { active: req.active, userView: userView, registered: registered, succeeded: succeeded, failure: failure })
  } catch (error) {
    console.log(error)
    next(error)
  }
})


router.get('/users/edit/:id',isAdmin, async (req, res) => {
  try {
    const userView = await prisma.user.findFirst({
      where: {
        id: Number(req.params.id)
      }
    })
    const Departments = await prisma.Department.findMany({})
    userView.type = getUserType(user)
    res.render('users/edit', { active: req.active, userView: userView, Departments:Departments })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('/users/delete/:id',isAdmin, async (req, res, next) => {
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

router.get('/users/Show_Subject/:id',isAdmin, async (req, res, next) => {
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

router.post('/CanEdit',isAdmin,async (req,res)=>{
  try {
    const {edit} = req.body
    await prisma.User.updateMany({data:{Edit:edit}})
    return res.json({ msg: "Done" })

  } catch (error) {
    console.log(error)
    return res.json({ msg: "error" })
  }
})

module.exports = router
