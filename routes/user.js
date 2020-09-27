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

//Processing register

module.exports = router;
