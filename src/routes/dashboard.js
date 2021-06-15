const router = require('express').Router();


function isAuthorized(req, res, next) {
	if(req.user) {
		console.log("User is logged in.");
		console.log(req.user);
		next();
	}
	else {
		console.log("User is not logged in.");
		res.redirect('/');
	}
}

router.get('/', isAuthorized, (req, res) => {
	res.render('dashboard');
});

router.get('/', isAuthorized, (req, res) => {
	res.sendStatus(200);
});

router.get('/settings', isAuthorized, (req, res) => {
	res.sendStatus(200);
});

module.exports = router;