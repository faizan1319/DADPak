var express = require('express');
var mysql = require('mysql');

var router = express.Router();
var pool = require('./dbconnection');

router.get('/:postId', function(req, res) {
	var sql = "SELECT c.comment_id, c.comment_text, c.user_id, u.username, u.dp_url FROM comments c INNER JOIN user u ON c.user_id = u.user_id WHERE c.post_id =" +req.params.postId;
	
	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results) {
			res.json(results);
			connection.release();
			if (error) throw error;
		});
	});
});

module.exports = router;

