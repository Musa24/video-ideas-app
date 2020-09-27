const express = require('express');
const router = express.Router();

//Register
router.get('/register', (req, res) => {
  res.render('users/register');
});

//login
router.get('/login', (req, res) => {
  res.render('users/login');
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
    res.send('Register');
  }
});

module.exports = router;
