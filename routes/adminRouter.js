const express = require('express')
const router = express.Router()
const {
  showDoctor,
  AssigneSubj,
  modify,
  showsubj
} = require('../controllers/admin/ManageDoctors')

router.get('/doctors', showDoctor) //show all doctors
router.get('/doctors/modify/:id', showsubj)
router.post('/doctors/modify/:us/:id', modify)
router.post('/doctors/:id', AssigneSubj)

module.exports = router
