const express = require('express');
const router = express.Router();

//Load Models
const Idea = require('../models/Idea');

//Fetching data from DB
router.get('/', (req, res) => {
  Idea.find({})
    .lean()
    .sort({ date: 'desc' })
    .then((ideas) => {
      res.render('ideas/index', {
        ideas,
      });
    });
});

//Add Form
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

//Processing a Form input
router.post('/', (req, res) => {
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
    })
      .save()
      .then((idea) => {
        req.flash('success_msg', 'Idea is created');
        res.redirect('/ideas');
      });
  }
});

//Edit Form
router.get('/edit/:id', (req, res) => {
  const { id } = req.params;

  Idea.find({ _id: id })
    .lean()
    .then((idea) => {
      res.render('ideas/edit', { idea: idea[0] });
    });
});

//Processing a Put request
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Idea.findByIdAndRemove({ _id: id }).then(() => {
    req.flash('success_msg', 'Idea is removed');
    res.redirect('/ideas');
  });
});

module.exports = router;
