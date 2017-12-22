var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = require('./dbconnection');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//login attempt
router.post('/login', function(req, res) {
	
	var username = req.body.username;
	var password = req.body.password;
	var sql = "SELECT userId, password, userType, firstname, lastname, email, phone, dpUrl, userType, employeePostCategoryId, postCount FROM user WHERE username = ?";
	var inserts = [username];
	sql = mysql.format(sql, inserts);
	var sql2 = 'SELECT us.categoryId, c.categoryName From userSubscription us INNER JOIN category c ON us.categoryId = c.categoryId WHERE userId = ?';
	pool.getConnection(function(err, connection) {
		connection.query(sql, function (error, results) {
			if (error) throw error;
			
			//if there is a user
			if(results.length > 0 ) {
				//check password
				if( password == results[0].password) {
					var userId = results[0].userId;
					var inserts2 = [userId];
					sql2 = mysql.format(sql2, inserts2);
					//get user subscriptions
					connection.query(sql2, function(err2, subscriptions) {
						connection.release();
						if(err2) throw err2;
						else {
							//append subscriptions in user information and send
							results[0].subscriptions = subscriptions;
							results[0].checkFlag = 1;
							res.json(results);
						}
					})
				}
				// if password unmatch, so according to front end logic i am sending a flag with value 2
				else { 
					var response = [{
						checkFlag: 2,
					}]
					res.json(response);
				}
			}
			else res.json(results); //no such user
		});
	});
});

router.get('/checkDuplicateUsername/:username', function(req, res) {
	pool.getConnection(function(err, connection) {
		var username = req.params.username;
		var sql = 'SELECT userId FROM user WHERE username = ?';
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
		var sql = 'SELECT userId FROM user WHERE email = ?';
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

		var sql='INSERT INTO user (firstname, lastname, username, email, password, userType, joinedAt) VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP())'; 
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

router.get('/userSubscriptions/:userId', function(req, res) {
	var userId = req.params.userId;
	var sql = 'SELECT categoryId From userSubscription WHERE userId = ?';
	var inserts = [userId];
	sql = mysql.format(sql, inserts);
	pool.getConnection(function(error, connection) {
		connection.query(sql, function(err, results) {
			connection.release();
			if(err) throw err;
			else {
				res.json(results);
			}
		})
	})
})

router.post('/changePassword', function(req, res) {
	var newPassword = req.body.password;
	var userId = req.body.userId;
	var sql = 'UPDATE user SET password = ? WHERE userId = ?';
	inserts = [newPassword, userId];
	sql = mysql.format(sql, inserts);
	pool.getConnection(function(error, connection) {
		connection.query(sql, function(err, results) {
			connection.release();
			console.log(results);
			res.json(results);
		})
	})
})



module.exports = router;

