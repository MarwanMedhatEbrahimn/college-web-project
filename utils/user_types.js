const USER_TYPES = Object.freeze({
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  USER: 'User'
})

function getUserType(user) {
  let type = ''
  if (user.isAdmin) {
    type = USER_TYPES.ADMIN
  } else if (user.isDoctor) {
    type = USER_TYPES.DOCTOR
  } else {
    type = USER_TYPES.USER
  }
  return type
}

function mapUserType(user, type) {
  let cloned = JSON.parse(JSON.stringify(user))
  if (type === USER_TYPES.ADMIN) {
    cloned.isAdmin = true
  } else if (type === USER_TYPES.DOCTOR) {
    cloned.isDoctor = true
  } else {
    cloned.isStudent = true
  }
  return cloned
}

module.exports = { getUserType, mapUserType }
