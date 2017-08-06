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

router.get('/checkDuplicateUsername/:username', function(req, res) {
	pool.getConnection(function(err, connection) {
		var username = req.params.username;
		var sql = 'SELECT user_id FROM user WHERE username = ?';
		var inserts = [username];
		sql = mysql.format(sql, inserts);

		connection.query(sql, function(error, results) {
			connection.release();
			if (error) throw error;
			else {
				if(results.length === 0) res.json(false);
				else res.json(true);
			}
		})
	})
})

router.get('/checkForEmailAlreadyExist/:email', function(req, res) {
	pool.getConnection(function(err, connection) {
		var email = req.params.email;
		var sql = 'SELECT user_id FROM user WHERE email = ?';
		var inserts = [email];
		sql = mysql.format(sql, inserts);

		connection.query(sql, function(error, results) {
			connection.release();
			if (error) throw error;
			else {
				if(results.length === 0) res.json(false);
				else res.json(true);
			}
		})
	})
})

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
			if(error) throw error;
			else {
				results.message = 'You have successfully joined the DAD community! Login and show whats happening around or see what others have to show.';
				res.json(results);
			}
		})
	})
})



module.exports = router;

