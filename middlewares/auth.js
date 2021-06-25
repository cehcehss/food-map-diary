module.exports = {
    isAuthenticated: (req, res, next) => {
      if (!req.isAuthenticated()) {
        req.flash('reminder', 'Kindly log in first!')
        return res.redirect('/users/login')
      }
      return next()
    }
  }