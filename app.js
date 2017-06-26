const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const homeRouter = require('./routes/home');
const indexRouter = require('./routes/index');
const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static('public'));

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set ('view engine', 'mustache');

app.use(session({
  secret: 'sshhh',
  resave: false,
  saveUninitialized: true
}));

app.get("/", function(req, res){
  res.render("home");
});

app.use('/home',homeRouter);
app.use('/index', indexRouter);

app.listen(8080, function() {
  console.log("Working hard... Listening on 8080");
});
