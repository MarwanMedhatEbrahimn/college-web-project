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
    res.render('users/doctors/modifyassign', {
      subjects: sub2,
      active: req.active
    })
  } catch (error) {
    next(error)
  }
}
const showsubj = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    const sub = await prisma.Subject.findMany({
      where: { userId: null }
    })
    res.render('users/doctors/assign', {
      subjects: sub,
      id: id,
      active: req.active
    })
  } catch (error) {
    next(error)
  }
}
const showsubjuser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const sub = await prisma.Subject.findMany({
      where: { userId: id }
    })
    res.render('users/doctors/modifyassign', {
      subjects: sub,
      id: id,
      active: req.active
    })
  } catch (error) {
    next(error)
  }
}
const Assign = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    subs = req.body.data
    if (!subs) {
      return
    }
    for (let i = 0; i < subs.length; i++) {
      const sub = parseInt(subs[i])
      await prisma.subject.update({
        where: { id: sub },
        data: { userId: id }
      })
    }
  } catch (error) {
    next(error)
  }

}
module.exports = { showDoctor, modify, showsubj, Assign, showsubjuser }
