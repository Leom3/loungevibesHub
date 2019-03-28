var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	console.log(req.user);
	if (req.user.username != "admin")
		res.redirect('/users/login');
	else {
		res.render('admin');
	}
});

module.exports = router;