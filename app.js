var createError = require('http-errors');
var express = require('express');
var app = express();
const flash = require('connect-flash')
const fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
const csrf = require('csurf')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');

const passport = require('passport')
const session = require('express-session')
const csrfProtection = csrf()

// Include models
const db = require('./models')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setup session
app.use(session({
  secret: 'kldxnflkdzsfrf',
  resave: 'false',
  saveUninitialized: 'false'
}))

// set up passport
app.use(passport.initialize())
app.use(passport.session())

require('./middlewares/passport')(passport)

// set up connect-flash
app.use(flash())

// use csrf protection middleware after session
app.use(csrfProtection)

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.reminder = req.flash('reminder')
  res.locals.warnings = req.flash('warning')
  res.locals.success = req.flash('success')
  // generate one CSRF token to every render page
  res.locals.csrfToken = req.csrfToken()
  next()
})


app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : path.join(__dirname,'tmp'),
}));


app.use(express.static('public'))
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
