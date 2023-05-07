const express = require('express')
const router = express.Router()
const {
  showsubj,
  Assign,
  showsubjuser,
  showsubj_of_doctor
} = require('../controllers/admin/ManageDoctors')
router.get('/doctors/modify/:id', showsubj)
router.post('/doctor/assign/:id', Assign)
router.get('/doctors/modifynew/:id', showsubj_of_doctor)



module.exports = router
