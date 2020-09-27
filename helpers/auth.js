module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error_msg', 'Not Authorized,Please Login In');
      res.redirect('/users/login');
    }
  },
};
