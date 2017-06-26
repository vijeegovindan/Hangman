// Require the following modules for the page
const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

//Use Routes for the pages : 1. Home Page :Select the mode ; 2. Index Page :Game Page
const homeRouter = require('./routes/home');
const indexRouter = require('./routes/index');
const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static('public'));

//Using mustache instead of static HTML
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set ('view engine', 'mustache');

// Initiate session
app.use(session({
  secret: 'sshhh',
  resave: false,
  saveUninitialized: true
}));

// Render Home Page to select the mode
app.get("/", function(req, res){
  res.render("home");
});
// Routers in use - check routes directory for files
app.use('/home',homeRouter);
app.use('/index', indexRouter);

app.listen(8080, function() {
  console.log("Working hard... Listening on 8080");
});
