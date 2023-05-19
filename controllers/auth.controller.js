const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

router.get('/login', async (req, res, next) => {
  try {
    res.render('pages/login', { active: req.active, error: false, email: '' })
  } catch (error) {
    next(error)
  }
})

router.get('/logout', async (req, res, next) => {
  req.session.destroy(function () {
    console.log('user logged out.')
  })
 return res.redirect('/login')
})

router.post('/login', async (req, res, next) => {
  
  const email = req.body.email
  const password = req.body.password
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })
    if(!user) {
     return res.render('pages/login', {
        error: true,
        email: "",
        active: req.active
      })
      
    }
    const isSamePassword = await bcrypt.compare(password, user.password)
    if (isSamePassword) {
      delete user.password
      req.session.user = user
      res.redirect('/users')
    } else {
      res.render('pages/login', {
        error: true,
        email: user.email,
        active: req.active
      })
    }
  } catch (error) {
    next(error)
  }
})
module.exports = router
