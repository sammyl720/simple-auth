module.exports = {
  ensureAuthenticated: (req, res, next) => {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash(
      'error_msg',
      'Please login to view this resource'
    )
    return res.redirect('/users/login')
  }
}
