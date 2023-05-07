const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

router.get('/login', async (req, res, next) => {
  try {
    res.render('pages/login', { active: req.active })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    // Find user in database
    const user = await prisma.User.findFirst({
      where: {
        email: email,
        password: password
      }
    });
    if (!user) {
      return res.status(401).send('<h1>Invalid email or password</h1>');

    } else if (user.isAdmin && password) {
      // Set user cookie
      res.cookie('user', user);
      return res.send('<h1>Admin</h1>');
    } else if (user.isStudent && password) {
      // Set user cookie
      res.cookie('user', user);
      return res.send('<h1>Student</h1>');
    } else if (user.isDoctor && password) {
      // Set user cookie
      res.cookie('user', user);
      return res.send('<h1>Doctor</h1>');
    }



    // Verify password
    // const isValidPassword = await bcrypt.compare(password, user.password);

    // if (!isValidPassword) {
    //   return res.status(401).send('Invalid email or password');
    // }

    // Set user type cookie
    // res.cookie('userType', userType);
    // console.log(userType)

    // // Redirect to appropriate page
    // if (userType === 'Student') {
    //   return res.redirect('/student');
    // } 
    // else if (userType === 'Admin') {
    //   return res.redirect('/admin');
    // } esle {
    //   return res.redirect('/Doctor');
    // }

    // res.json('sent')

  }
  // try {
  //   console.log(req.body)
  //   res.json('sent')
  // } 
  catch (error) {
    next(error)
  }
})

module.exports = router
