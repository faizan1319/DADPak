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
		var sql = "SELECT u.username, u.dp_url, p.post_id, p.post_title, p.post_desc, p.post_lat, p.post_lng, p.post_likes, p.post_dislikes, p.post_comment_count, p.user_id, DATEDIFF(CURRENT_DATE(), posted_date) AS date_diff, TIMEDIFF(CURRENT_TIME(), posted_time) AS time_diff FROM posts p INNER JOIN USER u ON p.user_id = u.user_id ORDER BY post_likes DESC LIMIT 7";
		connection.query(sql, function(error, results) {
			res.json(results);
			connection.release();
			if(error) throw error;
		});
	});
});

module.exports = router;
