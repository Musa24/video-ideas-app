const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Loading User model
const User = require('../models/User');
module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email }).then((user) => {
        if (!user) {
          console.log('Config', user);
          return done(null, false, { message: 'No user found' });
        }

        //Match password
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password Incorect' });
          }
        });
      });
    })
  );

  //Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
