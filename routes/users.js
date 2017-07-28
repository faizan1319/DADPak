var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = require('./dbconnection');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//login attempt
router.get('/login/:user/', function(req, res, next) {
	pool.getConnection(function(err, connection) {
  		var sql = "SELECT password FROM user WHERE username =";
  		sql += "'"+req.params.user+"'";
		connection.query(sql, function (error, results) {
			res.json(results);
			connection.release();
			if (error) throw error;
		});
	});
});

module.exports = router;

