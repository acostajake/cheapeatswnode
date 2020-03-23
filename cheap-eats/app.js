const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const express = require('express');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const helpers = require('./helpers');
const mongoose = require('mongoose');
const passport = require('passport');
const promisify = require('es6-promisify');
const path = require('path');
const routes = require('./routes/index');
const session = require('express-session');


const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport');

const MongoStore = require('connect-mongo')(session);
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // pug files
app.set('view engine', 'pug'); // inject template engine

// serves up static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Turns raw reqs into properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Validating data in userController.signup
app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and enable flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Handle logins
app.use(passport.initialize());
app.use(passport.session());

// // The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// Set routes
app.use('/', routes);

// 404 for bad routes
app.use(errorHandlers.notFound);

// See if errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Help devs
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;
