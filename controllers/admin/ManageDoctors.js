const prisma = require('../../prisma/client')

const showsubj = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    const sub = await prisma.Subject.findMany({
      //where: { userId: null }
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

const Assign = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    subs = req.body.data
    del = req.body.dele
    console.log(del)
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
    if (!del) {
      return
    }
    for (let i = 0; i < del.length; i++) {
      const de = parseInt(del[i])
      await prisma.subject.update({
        where: { id: de },
        data: { userId: null }
      })
    }

    return res.json({ msg: 'success' })
  } catch (error) {
    next(error)
  }
}
const showsubj_of_doctor = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const sub = await prisma.Subject.findMany({
      where: { userId: id }
    })
    res.send(sub)
  } catch (error) {
    next(error)
  }
}
module.exports = { showsubj, Assign, showsubj_of_doctor }
