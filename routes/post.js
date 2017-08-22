var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = require('./dbconnection');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('in posts');
});

router.get('/trending', function(req, res) {
	pool.getConnection(function(err, connection) {
		var sql = "SELECT u.username, u.dpUrl, p.postId, p.postMediaType, p.postMediaFilePath, p.postTitle, p.postDesc, p.postLat, p.postLng, p.postLikes, p.postDislikes, p.postCommentCount, p.userId, DATEDIFF(CURRENT_DATE(), postedDate) AS dateDiff, TIMEDIFF(CURRENT_TIME(), postedTime) AS timeDiff FROM posts p INNER JOIN user u ON p.userId = u.userId ORDER BY postLikes DESC LIMIT 7";
		connection.query(sql, function(error, results) {
			res.json(results);
			connection.release();
			if(error) throw error;
		});
	});
});

router.get('/getPostByUserId/:userId', function(req, res) {
	var userId = req.params.userId;
	var sql = "SELECT postId, postMediaType, postMediaFilePath, postTitle, postDesc, postLat, postLng, postLikes, postDislikes, postCommentCount, DATEDIFF(CURRENT_DATE(), postedDate) AS dateDiff, TIMEDIFF(CURRENT_TIME(), postedTime) AS timeDiff FROM posts WHERE userId = ?";
	var inserts = [userId];
	sql = mysql.format(sql, inserts);
	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results) {
			connection.release();
			if(error) throw error;
			res.json(results);
		})
	})
})


module.exports = router;
