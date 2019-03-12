var express = require('express');
var router = express.Router();

/*
// '/' route that make sure we are connected, or redirect us to login page
*/

router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

/*
// '/profile' route that make sure we are connected, or redirect us to login page
*/
router.get('/profile', ensureAuthenticated, function(req, res) {
  res.render('profile');
})

/*
// ensureAuthenticated function, that check if user is loged in
*/
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in / register');
		res.redirect('/users/login');
	}
}

module.exports = router;