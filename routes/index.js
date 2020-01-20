const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
// welcome page
router.get('/', async (req, res, next) => {
  res.render('welcome')
})

router.get(
  '/dashboard',
  ensureAuthenticated,
  async (req, res, next) => {
    res.render('dashboard', {
      name: req.user.name
    })
  }
)
module.exports = router
