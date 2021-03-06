const express = require('express');
const router = express.Router();

//Load Models
const Idea = require('../models/Idea');

//HELPERS
const { ensureAuthenticated } = require('../helpers/auth');

//Fetching data from DB
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .lean()
    .sort({ date: 'desc' })
    .then((ideas) => {
      res.render('ideas/index', {
        ideas,
      });
    });
});

//Add Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

//Processing a Form input
router.post('/', ensureAuthenticated, (req, res) => {
  const { title, details } = req.body;
  let errors = [];
  if (!title) {
    errors.push({ text: 'Please add a title' });
  }

  if (!details) {
    errors.push({ text: 'Please add a details' });
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title,
      details,
    });
  } else {
    new Idea({
      title,
      details,
      user: req.user.id,
    })
      .save()
      .then((idea) => {
        req.flash('success_msg', 'Idea is created');
        res.redirect('/ideas');
      });
  }
});

//Edit Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params;

  Idea.find({ _id: id })
    .lean()
    .then((idea) => {
      if (idea.user !== req.user.id) {
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/ideas');
      } else {
        res.render('ideas/edit', { idea: idea[0] });
      }
    });
});

//Processing a Put request
router.put('/:id', ensureAuthenticated, (req, res) => {
  const { title, details } = req.body;
  const { id } = req.params;
  Idea.findByIdAndUpdate(
    { _id: id },
    { title, details },
    (err, updatedIdea) => {
      if (err) {
        console.log(err);
      } else {
        req.flash('success_msg', 'Idea is updated');
        res.redirect('/ideas');
      }
    }
  );
});

//DELETE IDEA
router.delete('/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params;
  Idea.findByIdAndRemove({ _id: id }).then(() => {
    req.flash('success_msg', 'Idea is removed');
    res.redirect('/ideas');
  });
});

module.exports = router;
