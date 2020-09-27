const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const app = express();

//Connect to the DB
require('./config/db');

//Loading routes
const ideas = require('./routes/ideas');
const users = require('./routes/user');

//Passport config
const configPassportStrategy = require('./config/passport');
configPassportStrategy(passport);

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

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//express handlebar middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//express middleware
app.use(express.urlencoded({ extended: true }));

//methodOverride middleware
app.use(methodOverride('_method'));

//Set up public folder (Express static folder)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/', (req, res) => {
  res.render('index');
});

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('The server is started');
});
