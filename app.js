const express = require('express');
const exphbs = require('express-handlebars');
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

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//Processing a Form input
app.post('/ideas', async (req, res) => {
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
    try {
      const idea = await new Idea({
        title,
        details,
      });
      res.redirect('/ideas');
      console.log(idea);
    } catch (error) {
      console.log(error);
    }
  }
});

app.listen(PORT, () => {
  console.log('The server is started');
});
