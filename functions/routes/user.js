var express = require('express');
var User	= require('../app/models/user');
var Account = require('../app/models/account');
var Data 	= require('../app/models/test');
var Chat 	= require('../app/models/chat');

module.exports = function(app, passport) {

	// =============================================================================
	// AUTHENTICATED (Routes that are authenticated
	// (user should be signed in for routes to be accessible)) ===
	// =============================================================================

	// =============================================
	// PRE-PROFILE SECTION =========================
	// ADDITIONAL INFO FORM PAGE
	app.get('/userinfo', isLoggedIn, function(req, res) {
		res.render('user/acc-details', {user: req.user, title: 'user-info | Techxodus'});
	});
	// =============================================================================
	// SAVING USER ACCOUNT DETAILS
	app.post('/userinfo', function(req, res, next) {
		var	user	= req.user;
		var bank_name  = req.body.bank_name;
		var account_name = req.body.account_name;
		var account_number = req.body.account_number;
		var phone_number = req.body.phone_number;

		var bitcoin 	= req.body.bitcoin;

		var referrer_email = req.body.referrer_email;
		var referred	= req.body.referred;
		var points = req.body.points;
		var message = req.body.message;

		var account = new Account();
		account.user	= req.user;
		account.bank_name  = bank_name;
		account.account_name = account_name;
		account.account_number = account_number;
		account.phone_number = phone_number;

		account.bitcoin = bitcoin;

		account.referrer_email = referrer_email;
		account.referred = referred;
		account.points = points;
		account.message = message;
		account.save(function(err, savedAccount) {
			if(err) {
				console.log(err);
			} else {
			console.log('User account details successfully added');
			res.redirect('/home');
			}
		});
	});
	// END OF ADDITIONAL USER DETAILS



	// HOME ROUTE - update route
	app.post('/home', isLoggedIn, function (req, res, next) {
		var commit = Commit({user: req.user});
		Commit.findOne({user: req.user}, function(err, commit) {
	    if (err) {
	      console.error('error, no entry found');
	    }
	    commit.commit_type= req.body.commit_type || commit.commit_type,
	    commit.crypto_addr= req.body.crypto_addr || commit.crypto_addr,
	    commit.commit_value= req.body.commit_value || commit.commit_value,
	    commit.save();
		})
		res.redirect('/home')
	});
	// =============================================================================
	app.get('/home', isLoggedIn, function (req, res, next) {
		var account = Account({user: req.user});
		Account.findOne({user: req.user}, function(err, account) {
			if (err) {
				res.send(500);
				return;
			}
		Data.find()
		  .then(function(doc) {console.log(account)
		  });
		Chat.find({user: req.user}, function(err, chats) {
			if (err) {
				res.send(500);
				return;
			}
			var chatChunks = [];
			var chunkSize = 1;
			for (var i = 0; i < chats.length; i += chunkSize) {
				chatChunks.push(chats.slice(i, i + chunkSize));
			}
			console.log(chats)
			res.render('user/home', {user: req.user, title: 'Techxodus | Home', account: account, chats: chatChunks});
		});
		});
	});
	// =============================================================================



	// =============================================================================
	// WORK IN PROGRESS (This is where experimental code and features are being
	// tested)
	// =============================================================================
	app.get('/test', isLoggedIn, function(req, res) {
		res.render('user/test');
	});


	// KNOWLEDGE-BASE OF ALL THINGS DUFFLEBUG.
	app.get('/doc', isLoggedIn, function(req, res) {
		res.render('user/doc');
	});
	// END OF TEST ROUTES
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// =============================================================================


	// =============================================================================
	// UN-AUTHENTICATED (for all) ==================================================
	// =============================================================================
	// route middleware to ensure user is not logged in
	// app.use('/', notLoggedIn, function(req, res, next) {
	// 	next();
	// });

	// Experimental: should be romoved in production.

	// RULES OF THE GAME

	// INFO ABOUT US
	app.get('/about', function(req, res) {
		res.render('home/about-us', {title: 'About | Techxodus'});
	});

	// THE TEAM
	app.get('/team', function(req, res) {
		res.render('home/team', {title: 'Team | Techxodus'});
	});

	// Go to this page to get our privacy policy
	app.get('/privacy-terms', function(req, res) {
		res.render('home/privacy-terms', {title: 'Terms | Techxodus'});
	});

	// ourwork from real people
	app.get('/ourwork', function(req, res) {
	// 	res.render('home/ourwork', {title: 'Terms | Techxodus'});
	// });
		Account.find(function(err, docs) {
			var accountChunks = [];
			var chunkSize = 4;
			for (var i = 0; i < docs.length; i += chunkSize) {
				accountChunks.push(docs.slice(i, i + chunkSize));
			}
			res.render('home/ourwork', {title: 'ourwork', accounts: accountChunks });
		});
	});

	// LOGOUT ==============================
	app.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});



	// =============================================================================
	// AUTHENTICATE (FIRST LOGIN) ==================================================
	// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the signin form
		app.get('/signin', function(req, res) {
			res.render('user/signin', {title: 'Signin | Techxodusue', message: req.flash('message')});
		});

		// process the login form (successRedirect : '/profile',)
		app.post('/signin', passport.authenticate('local-login', {
			successRedirect : '/home', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));
	// =============================================================================
	// AUTHENTICATE (SIGNUP) =======================================================
	// =============================================================================
		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('user/signup', {title: 'Signup | Techxodusue', message: req.flash('message')});
		});

		// process the signup form (successRedirect : '/profile',)
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/userinfo', // redirect to the secure profile section ----------- /profile ----------
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

};

	// route middleware to ensure user is logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		//req.session.oldUrl = req.url; L
		res.redirect('/');
	}
