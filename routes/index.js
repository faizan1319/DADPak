var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Faizan' });
});
router.get('/checking', function(req, res){
	res.send('Chal gaya');
});

module.exports = router;
