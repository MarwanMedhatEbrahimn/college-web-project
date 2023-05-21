const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

router.get('/', async (req, res, next) => {
  try {
    if(req.session.user){
      user=req.session.user
      subjects=0;
      if(user.isDoctor)
        subjects = await prisma.Subject.findMany({where:{userId: user.id}}) 
      if(user.isStudent){
        subjects = await prisma.stateOFsub.findMany({
          select: {
            subject: {
              select:{name:true,userId:true,id:true}
            },
            subject: {
              include:{User:true}
            }
          },
            where:{user_Id: user.id, state:"registered"}
          })
      }
        
      res.render('index', { subjects:subjects, active: 'home' })
    }
    else{
      res.render('index', { active: 'home' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
