const express = require('express')
const router = express.Router()
const {
  showDoctor,
  modify,
  showsubj,
  Assign,
  showsubjuser
} = require('../controllers/admin/ManageDoctors')
router.get('/doctors/sub/:id', showsubjuser)
router.get('/doctors', showDoctor) //show all doctors
router.get('/doctors/modify/:id', showsubj)
router.post('/doctors/modify/:us/:id', modify)
router.post('/doctor/assign/:id', Assign)

module.exports = router
