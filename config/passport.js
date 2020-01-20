const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      (email, password, done) => {
        // Match user
        User.findOne({ email: email }).then(user => {
          if (!user) {
            return done(null, false, {
              message: 'That e-mail is not registered'
            })
          }

          // Match password
          bcrypt
            .compare(password, user.password)
            .then(isMatch => {
              if (isMatch) {
                return done(null, user)
              } else {
                return done(null, false, {
                  message: 'Password incorrect'
                })
              }
            })
        })
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
