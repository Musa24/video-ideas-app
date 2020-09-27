const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

const PORT = 5000;

//Connect to the DB
require('./config/db');

//connect flash middleare
app.use(flash());

//express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

//GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

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
        req.flash('success_msg', 'Idea is created');
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
        req.flash('success_msg', 'Idea is updated');
        res.redirect('/ideas');
      }
    }
  );
});

//DELETE IDEA
app.delete('/ideas/:id', (req, res) => {
  const { id } = req.params;
  Idea.findByIdAndRemove({ _id: id }).then(() => {
    req.flash('success_msg', 'Idea is removed');
    res.redirect('/ideas');
  });
});

app.listen(PORT, () => {
  console.log('The server is started');
});
