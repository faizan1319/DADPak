// var app = require('../app');

var express = require('express');
// var bodyParser = require('body-parser');

// var app = express();
var router = express.Router();
var pool = require('./dbconnection');

// app.use(bodyParser.json());


router.get('/:postId', function(req, res) {
	var sql = "SELECT c.commentId, c.commentText, c.userId, u.username, u.dpUrl, DATEDIFF(CURRENT_DATE(), postedDate) AS dateDiff, TIMEDIFF(CURRENT_TIME(), postedTime) AS timeDiff FROM comments c INNER JOIN user u ON c.userId = u.userId WHERE c.postId =" +req.params.postId;
	
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

	var sql1 = "UPDATE posts SET postCommentCount = postCommentCount + 1 WHERE postId = " + postId ;
	var sql2 = "INSERT INTO comments (commentText, postId, userId, postedDate, postedTime) VALUES ('"+ commentText +"', "+ postId + ", "+ userId + ", "+ "CURDATE(), CURTIME())";
	console.log(sql1);

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
	
	var sql = "SELECT postCommentCount, postLikes, postDislikes FROM posts WHERE postId = " + req.params.postId;

	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results) {
			res.json(results);
		})
	})
})

module.exports = router;
