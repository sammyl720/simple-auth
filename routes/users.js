const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const router = express.Router()
const passport = require('passport')
// start creating your routes
router.get('/login', async (req, res, next) => {
  res.render('Login')
})

router.get('/register', async (req, res, next) => {
  res.render('register')
})

// register handler
router.post('/register', (req, res, next) => {
  // console.log(req.body)
  const { name, email, password, password2 } = req.body

  const errors = []

  // check required fields
  if (!name || !email || !password || !password2) {
    errors.push({
      msg: 'Please fill out all fields'
    })
  }
  if (password !== password2) {
    errors.push({
      msg: 'Passwords do not match'
    })
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Password should be at least 6 characters'
    })
  }

  if (errors.length > 0) {
    return res.render('register', {
      name,
      email,
      password,
      password2,
      errors
    })
  } else {
    // Validation passed
    User.findOne({ email })
      .then(user => {
        if (user) {
          errors.push({
            msg: 'E-mail already registered'
          })
          return res.render('register', {
            name,
            email,
            password,
            password2,
            errors
          })
        } else {
          const newUser = new User({
            name,
            email,
            password
          })
          // hash password
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err
            bcrypt.hash(
              newUser.password,
              salt,
              (error, hashedPassword) => {
                if (error) {
                  throw error
                }
                // set password to hash
                newUser.password = hashedPassword
                newUser
                  .save()
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'You are now registered and can login'
                    )
                    res.redirect('/users/login')
                  })
                  .catch(e => console.log(e))
              }
            )
          })
        }
      })
      .catch(e => console.log(e))
  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

router.get('/logout', (req, res, next) => {
  req.logout()
  req.flash('success_msg', 'You are Logged out')
  res.redirect('/users/login')
})
module.exports = router
