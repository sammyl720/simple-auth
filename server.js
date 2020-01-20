const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
require('dotenv').config()
const app = express()

// passport config
require('./config/passport')(passport)
// ejs
app.use(expressLayouts)
app.set('view engine', 'ejs')
/* initalize port variable */
const PORT = process.env.PORT || 5000

// initalize json middleware to accept json
app.use(
  express.urlencoded({
    extended: false
  })
)

// express session middleware
app.use(
  session({
    secret: 'funky noise cat',
    resave: false,
    saveUninitialized: true
  })
)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())
// connect flash
app.use(flash())

// global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')

  next()
})
/* @route: '/'
@desc: initial home route that responds with 'Hello World!
@method: GET
*/
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('connected to database...')
  })
  .catch(err => console.log(err))
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT)
})
