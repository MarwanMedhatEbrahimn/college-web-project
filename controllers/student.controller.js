const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')
const { getUserType, mapUserType } = require('../utils/user_types')
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
//
router.get('/Student/register_Subject',isStudent,async(req,res,next)=>{
  try {
    var user = req.session.user
    user = await prisma.user.findFirst({where:{id:user.id}})
    Subjects = await prisma.Subject.findMany()
    userObject = await prisma.user.findFirst({where:{id:user.id}, 
      include:{stateOFsub:{include:{subject:true}}}})
    const usStSu=userObject.stateOFsub;
    const succeededSub = userObject.stateOFsub.filter(ele=>{
      if(ele.state == "succeeded"){
        return ele;
      }
    })
    const registerSub = userObject.stateOFsub.filter(ele=>{
      if(ele.state == "registered"){
        return ele;
      }
    })
    Subjects = Subjects.filter((element)=>{
      var flag=1
      for(i=0;i<usStSu.length;i++){
          if(usStSu[i].subject.name==element.name&&(usStSu[i].state!="failure")){     
            flag=0
            break
          }
      }

      if(flag==1 && element.dependencies){
        const dependencies = element.dependencies.split(",")
        for(i=0;i<dependencies.length-1;i++){
          flag=0
          for(j=0;j<succeededSub.length;j++){
            if(succeededSub[j].subject.name==dependencies[i]){     
              flag=1
              break
            }
          }
          if(flag==0){break}
        }
      }
      if(flag==1){return element}
    })
    res.render("student/Registration", {SubR:registerSub, Subjects:Subjects, Edit:user.Edit, active: req.active})
  } catch (error) {
    next(error)
  }
})

router.get("/download/:filename",isStudent, async function (req, res) {
  res.download("./uploads/" + req.params.filename);
});

router.post("/RegusterToSubject",isStudent, async function (req, res) {
  try {
    var user = req.session.user
    user = await prisma.user.findFirst({where:{id:user.id}})
    var {id} = req.body
    if(user.Edit==true){ 
      await prisma.stateOFsub.create({
        data:{user_Id:user.id , subject_id:id,
        state:"registered"}
      })

    }
    Subjects = await prisma.Subject.findMany()
    userObject = await prisma.user.findFirst({where:{id:user.id}, 
      include:{stateOFsub:{include:{subject:true}}}})
    const usStSu=userObject.stateOFsub;
    const succeededSub = userObject.stateOFsub.filter(ele=>{
      if(ele.state == "succeeded"){
        return ele;
      }
    })
    const registerSub = userObject.stateOFsub.filter(ele=>{
      if(ele.state == "registered"){
        return ele;
      }
    })
    Subjects = Subjects.filter((element)=>{
      var flag=1
      for(i=0;i<usStSu.length;i++){
          if(usStSu[i].subject.name==element.name&&(usStSu[i].state!="failure")){     
            flag=0
            break
          }
      }

      if(flag==1 && element.dependencies){
        const dependencies = element.dependencies.split(",")
        for(i=0;i<dependencies.length;i++){
          flag=0
          for(j=0;j<succeededSub.length;j++){
            if(succeededSub[j].subject.name==dependencies[i]){     
              flag=1
              break
            }
          }
          if(flag==0){break}
        }
      }
      if(flag==1){return element}
    })
    res.set('Access-Control-Allow-Origin', '*');
    return res.json({ Subjects: Subjects,  SubR:registerSub, Edit:user.Edit})
  } catch (error) {
    console.log(error)
    return res.json({ Subjects: {} , SubR:registerSub, Edit:user.Edit})
  }
});
router.post("/DeregisteredToSubject",isStudent, async function (req, res) {
  try {
    var user = req.session.user
    user = await prisma.user.findFirst({where:{id:user.id}})
    var {id} = req.body
    if(user.Edit==true){ 
      await prisma.stateOFsub.delete({
        where:{id:id}
      })
    }
    Subjects = await prisma.Subject.findMany()
    userObject = await prisma.user.findFirst({where:{id:user.id}, 
      include:{stateOFsub:{include:{subject:true}}}})
    const usStSu=userObject.stateOFsub;
    const succeededSub = userObject.stateOFsub.filter(ele=>{
      if(ele.state == "succeeded"){
        return ele;
      }
    })
    const registerSub = userObject.stateOFsub.filter(ele=>{
      if(ele.state == "registered"){
        return ele;
      }
    })
    Subjects = Subjects.filter((element)=>{
      var flag=1
      for(i=0;i<usStSu.length;i++){
          if(usStSu[i].subject.name==element.name&&(usStSu[i].state!="failure")){     
            flag=0
            break
          }
      }

      if(flag==1 && element.dependencies){
        const dependencies = element.dependencies.split(",")
        for(i=0;i<dependencies.length;i++){
          flag=0
          for(j=0;j<succeededSub.length;j++){
            if(succeededSub[j].subject.name==dependencies[i]){     
              flag=1
              break
            }
          }
          if(flag==0){break}
        }
      }
      if(flag==1){return element}
    })
    res.set('Access-Control-Allow-Origin', '*');
    return res.json({ Subjects: Subjects,  SubR:registerSub, Edit:user.Edit})
  } catch (error) {
    console.log(error)
    return res.json({ Subjects: {} , SubR:registerSub, Edit:user.Edit})
  }
});


router.get('/Student/Profile',isStudent, async (req, res) => {
  try {
    var id = Number(req.session.user.id)
    const user = await prisma.user.findFirst({
      where: {
        id: id
      },
      include: {
        subjects: true,
        department: true
      }
    })
    const succeeded = await prisma.stateOFsub.findMany({
      where:{
        user_Id: id,
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
        user_Id: id,
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
        user_Id: id,
        state: "registered"
      },
      include: {
        subject: {
          select :{name:true, code:true,department:true}
        }
      }
    })
    user.type = getUserType(user)
    res.render('student/Profile', { active: req.active, user: user, registered: registered, succeeded: succeeded, failure: failure })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = router