var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = require('./dbconnection');

router.post('/postImages', function(req, res) {
	pool.getConnection(function(err, connection) {
		var sql = "INSERT INTO posts (post_title, post_desc, post_lat, post_lng, user_id) VALUES (?, ?, ?, ?, ?)";
		var inserts = [req.body.postTitle, req.body.postDesc, req.body.postLat, req.body.postLng, req.body.userId];
		sql = mysql.format(sql, inserts);
		connection.query(sql, function(error, results) {
			res.json(results);
			connection.release();
			if(error) throw error;
		});
	});
});


module.exports = router;