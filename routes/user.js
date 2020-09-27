const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Loading model
const User = require('../models/User');

//login
router.get('/login', (req, res) => {
  res.render('users/login');
});
//Processing a Login request
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next); //Immediately call the func
});

//Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//Register
router.get('/register', (req, res) => {
  res.render('users/register');
});
//Processing register request
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password, password1 } = req.body;

  //Validation
  let errors = [];
  if (password !== password1) {
    errors.push({ text: 'Password doe not match' });
  }

  if (password.length < 6) {
    errors.push({ text: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      firstName,
      lastName,
      email,
      password1,
      password,
      errors,
    });
  } else {
    //Check if the email is unique
    User.findOne({ email: email }).then((user) => {
      if (user) {
        req.flash('error_msg', 'Email already registered by another user');
        res.redirect('/users/register');
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then((user) => {
              req.flash('success_msg', 'You are registered');
              res.redirect('/users/login');
            });
          });
        });
      }
    });
  }
});

module.exports = router;
