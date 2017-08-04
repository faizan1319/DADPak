var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = require('./dbconnection');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//login attempt
router.get('/login/:user/', function(req, res) {
	pool.getConnection(function(err, connection) {
  		var sql = "SELECT user_id, password FROM user WHERE username =";
  		
  		sql += "'"+req.params.user+"'";
		connection.query(sql, function (error, results) {
			res.json(results);
			connection.release();
			if (error) throw error;
		});
	});
});

router.post('/signup',function(req, res){
	pool.getConnection(function(err, connection){
		var firstname = req.body.firstname;
		var lastname = req.body.lastname;
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;

		var sql='INSERT INTO user (firstname, lastname, username, email, password, joined_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP())'; 
		var inserts = [firstname, lastname, username, email, password];
		sql = mysql.format(sql, inserts);

		connection.query(sql, function(error, results){
			connection.release();
			res.json(results);
			if(error) throw error;
		})
	})
})

module.exports = router;

