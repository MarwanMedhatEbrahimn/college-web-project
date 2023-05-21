const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')
const upload = require("./Upload/upload.js")
const {isDoctor} = require("../middlewares/auth")
//Show subject
router.get('/Doctor/subject/:id',isDoctor, async (req, res, next) => {
  try {
    Files = await prisma.Files.findMany({where:{SubjectId:Number(req.params.id)}})
    res.render('doctor/index',{ Files:Files,id:Number(req.params.id), active: req.active})
  } catch (error) {
    next(error)
  }
})

//Files controller
router.get('/Doctor/delete/:id/Subject/:Subid',isDoctor, async (req, res, next) => {
  try {
    await prisma.Files.delete({where:{id:Number(req.params.id)}})
    res.redirect('/Doctor/subject/'+Number(req.params.Subid))
  } catch (error) {
    next(error)
  }
})
router.get('/Doctor/edit/:id',isDoctor, async (req, res, next) => {
  try {
    file = await prisma.Files.findFirst({where:{id:Number(req.params.id)}})
    res.render('doctor/edit',{active: req.active, file : file })
  } catch (error) {
    next(error)
  }
})
router.post('/Doctor/edit/:id/Subject/:Subid',isDoctor, async (req, res, next) => {
  try {
    let {name, description} = req.body
    file = await prisma.Files.update({where:{id:Number(req.params.id)},data:{Name:name, description:description}})
    res.redirect('/Doctor/subject/'+Number(req.params.Subid))
  } catch (error) {
    next(error)
  }
})
router.get('/Doctor/File/Add/:id', isDoctor, async (req, res, next) => {
  try {
    res.render('doctor/Add',{ id: Number(req.params.id),active: req.active})
  } catch (error) {
    next(error)
  }
})

router.post("/Doctor/File/Add/:id", upload.single("file") , async function (req, res) {

  try {
    let { name, description } = req.body
    await prisma.Files.create({data:{
        Name:name, description:description, 
        Url:req.file.filename,SubjectId:Number(req.params.id)
      }})
    
    res.redirect('/Doctor/subject/'+Number(req.params.id))

  } catch (error) {
    next(error)
  }
});

router.get("/download/:filename", async function (req, res) {
  res.download("./uploads/" + req.params.filename);
});

//Students degrees
router.get("/doctor/Student_registered/:id",isDoctor,async (req,res)=>{
  try {
    const Students = await prisma.stateOFsub.findMany({
      where:{subject_id:Number(req.params.id),state:"registered"},
      include:{user:true}
    })
    res.render('doctor/degrees',{active:req.active,Students:Students,id:Number(req.params.id)})

  } catch (error) {
    next(error)
  }
});


router.post("/update-degree",isDoctor,async (req,res)=>{
  try {
    
    let {degree , id} = req.body
    await prisma.stateOFsub.update({where:{id:Number(id)},data:{degree:Number(degree)}})
    return res.json({ msg: 'success' })

  } catch (error) {
    return res.json({ msg: 'faild' })
  }
})
router.post("/EndTerm/:id",isDoctor,async (req,res)=>{
  try {
    var states = await prisma.stateOFsub.findMany({where:{subject_id:Number(req.params.id),state:"registered"}})
    for (const element of states) {
      if(element.degree>=50){
        await prisma.stateOFsub.update({where:{id:element.id},data:{state:"succeeded"}})
      }
      else{
        await prisma.stateOFsub.update({where:{id:element.id},data:{state:"failure"}})
      }
    }
    res.redirect("/Doctor/subject/"+Number(req.params.id))
  } catch (error) {
    console.log(error)
    res.next()
  }
})


module.exports = router