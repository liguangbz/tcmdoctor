var bodyParser = require('body-parser');
var express = require('express'),
	app = express();
var session = require('express-session');
var app = express()

app.use(session({
  secret: '12344321qwert',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000*60*10 }
}))

app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = "";
    console.log("oh, god, error!")
    if (err) {
        res.locals.message = '<div class="" style="color:red;">'+err+'</div>';
    }
    next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer()); // for parsing multipart/form-data

var router = express.Router();
// This is needed if the app is run on heroku:

var port = process.env.PORT || 80;

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.

var io = require('socket.io').listen(app.listen(port, "0.0.0.0"));
//var io = require('socket.io').listen(app.listen(port, "localhost"));
//var io = require('socket.io').listen(app.listen(port, "10.8.3.184"));

// Require the configuration and the routes files, and pass
// the app and io as arguments to the returned functions.

require('./config')(app, io);
require('./routes')(app, io);

console.log('Your application is running on http://localhost:' + port);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});
