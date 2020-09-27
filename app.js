const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const app = express();

const PORT = 5000;

//Connect to the DB
require('./config/db');

//Load Models
const Idea = require('./models/Idea');

//express handlebar middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//express middleware
app.use(express.urlencoded({ extended: true }));

//methodOverride middleware
app.use(methodOverride('_method'));

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/', (req, res) => {
  res.render('index');
});

//Fetching data from DB
app.get('/ideas', (req, res) => {
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
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//Processing a Form input
app.post('/ideas', (req, res) => {
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
        res.redirect('/ideas');
      });
  }
});

//Edit Form
app.get('/ideas/edit/:id', (req, res) => {
  const { id } = req.params;

  Idea.find({ _id: id })
    .lean()
    .then((idea) => {
      res.render('ideas/edit', { idea: idea[0] });
    });
});

//Processing a Put request
app.put('/ideas/:id', (req, res) => {
  const { title, details } = req.body;
  const { id } = req.params;
  Idea.findByIdAndUpdate(
    { _id: id },
    { title, details },
    (err, updatedIdea) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/ideas');
      }
    }
  );
});

//DELETE IDEA
app.delete('/ideas/:id', (req, res) => {
  const { id } = req.params;
  Idea.findByIdAndRemove({ _id: id }).then(() => {
    res.redirect('/ideas');
  });
});

app.listen(PORT, () => {
  console.log('The server is started');
});
