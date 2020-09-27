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

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(PORT, () => {
  console.log('The server is started');
});
