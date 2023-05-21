const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')
const {isStudent} = require("../middlewares/auth")


//Show subject
router.get('/Subject/:id',isStudent, async (req, res, next) => {
    try {
      Files = await prisma.Files.findMany({where:{SubjectId:Number(req.params.id)}})
      res.render('student/Subject',{ Files:Files,id:Number(req.params.id), active: req.active})
    } catch (error) {
      next(error)
    }
})



router.get("/download/:filename",isStudent, async function (req, res) {
  res.download("./uploads/" + req.params.filename);
});

module.exports = router