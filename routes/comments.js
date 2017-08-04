// var app = require('../app');

var express = require('express');
// var bodyParser = require('body-parser');

// var app = express();
var router = express.Router();
var pool = require('./dbconnection');

// app.use(bodyParser.json());


router.get('/:postId', function(req, res) {
	var sql = "SELECT c.comment_id, c.comment_text, c.user_id, u.username, u.dp_url, DATEDIFF(CURRENT_DATE(), posted_date) AS date_diff, TIMEDIFF(CURRENT_TIME(), posted_time) AS time_diff FROM comments c INNER JOIN user u ON c.user_id = u.user_id WHERE c.post_id =" +req.params.postId;
	
	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results) {
			res.json(results);
			connection.release();
			if (error) throw error;
		});
	});
});

router.post('/incomming', function(req, res) {

	console.log(req.body);
	var commentText = req.body.comment;
	var postId = req.body.postId;
	var userId = req.body.userId;

	var sql1 = "UPDATE posts SET post_comment_count = post_comment_count + 1 WHERE post_id = " + postId ;
	var sql2 = "INSERT INTO comments (comment_text, post_id, user_id, posted_date, posted_time) VALUES ('"+ commentText +"', "+ postId + ", "+ userId + ", "+ "CURDATE(), CURTIME())";

	pool.getConnection(function(err, connection) {
		connection.query(sql1, function(error, results) {
			connection.release();
			if (error) throw error;
		});
	});

	pool.getConnection(function(err, connection) {
		connection.query(sql2, function(error, results) {
			res.json(results);
			connection.release();
			if (error) throw error;
		});
	});
})

router.get('/counts/:postId', function(req, res) {
	
	var sql = "SELECT post_comment_count, post_likes, post_dislikes FROM posts WHERE post_id = " + req.params.postId;

	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results) {
			res.json(results);
		})
	})
})

module.exports = router;
