//
module.exports = function(app) {



// normal routes ===============================================================
	app.get('/', function(req, res) {
		res.render('index.hbs');
	});

	app.get('/about', function(req, res) {
		res.render('company/about-us', {title: 'About | Techxodusng'});
	});

	app.get('/portfolio', function(req, res) {
		res.render('company/portfolio', {title: 'Portfolio | Techxodusng'});
	});

	app.get('/contact', function(req, res) {
		res.render('contact-us', {title: 'Contact Us | Techxodusng'});
	});

	app.get('/blog', function(req, res) {
		res.render('blog', {title: 'Blog | Techxodusng'});
	});

	app.get('/Ideas', function(req, res) {
		res.render('company/ideas', {title: 'Ideas | Techxodusng'});
	});
// closing curly brace fpr module.exports
};
