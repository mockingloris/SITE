// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var port     = process.env.PORT || 5000;
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var passport = require('passport');
var flash    = require('connect-flash');
var expressHbs = require('express-handlebars');
var favicon = require('serve-favicon');
// var validator = require('express-validator');

var path = require('path');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var MongoStore	=	require('connect-mongo')(session);

var app      = express();
// // load our routes and pass in our app and fully configured passport
// var routes = require('./routes/index.js')(app, passport);
// var userRoutes = require('./routes/user.js')(app, passport);

//uncomment below to enable DB
// var configDB = require('./config/database.js');
// configuration ===============================================================
// mongoose.connect(configDB.url); // connect to our database

var uristring = process.env.MONGODB_URI || 'mongodb://127.0.0.1/t3chx0du5';
mongoose.connect(uristring);

require('./config/passport')(passport); // pass passport for configuration


app.engine('.hbs', expressHbs({extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// set up our express application

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(validator());
app.use(cookieParser()); // read cookies (needed for auth)


// required for passport
app.use(session({
 secret: 'YHB874TBGTsttTH6uvyuvsv',
 resave: false,
 saveUninitialized: false,
 store: new MongoStore({ mongooseConnection: mongoose.connection }),
 cookie: { maxAge: 180 * 60 * 1000 }
})); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


//app.use(express.static('public'))
app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static(path.join(__dirname, '/views')));

// // sectioned routes for user related and basic index
// app.use('/user', userRoutes);
// app.use('/', routes);

app.use(function(req, res, next) {
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	next();
});

// routes ======================================================================
require('./routes/user.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Techxodus oppening on port ' + port);
