const prisma = require('../../prisma/client')

const showDoctor = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isDoctor: true
      },
      include: {
        subjects: true,
        department: true
      }
    })

    const subjects = await prisma.Subject.findMany({
      where: {
        userId: null
      }
    })
    res.render('users/doctors/admindoctor', {
      users: users,
      subjects: subjects,
      active: req.active
    })
  } catch (error) {
    next(error)
  }
}

const AssigneSubj = async (req, res, next) => {
  let subj = req.body['my-dropdown']
  const id = parseInt(req.params.id)

  try {
    const sub = await prisma.Subject.findFirst({
      where: { name: subj }
    })

    const u = await prisma.Subject.update({
      where: { id: sub.id },
      data: {
        userId: id
      }
    })

    const users = await prisma.user.findMany({
      where: {
        isDoctor: true
      }
    })

    const subjects = await prisma.Subject.findMany({
      where: {
        userId: null
      }
    })

    res.render('users/doctors/admindoctor', {
      users: users,
      subjects: subjects,
      active: req.active
    })
  } catch (error) {
    next(error)
  }
}
const modify = async (req, res, next) => {
  try {
    const iD = parseInt(req.params.id)
    const user = parseInt(req.params.us)

    await prisma.Subject.update({
      where: { id: iD },
      data: { userId: null }
    })

    const sub2 = await prisma.Subject.findMany({
      where: { userId: user }
    })
    res.render('users/doctors/modifyassign', { sub: sub2, active: req.active })
  } catch (error) {
    next(error)
  }
}
const showsubj = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    const sub = await prisma.Subject.findMany({
      where: { userId: id }
    })
    res.render('users/doctors/modifyassign', { sub: sub, active: req.active })
  } catch (error) {
    next(error)
  }
}

module.exports = { showDoctor, AssigneSubj, modify, showsubj }
