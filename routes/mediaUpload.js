var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer = require('multer');

var storagePath = __dirname+'/public/images/postImages/';
var uploads = multer({dest: storagePath})

var pool = require('./dbconnection');

router.post('/postImages', function(req, res) {
	pool.getConnection(function(err, connection) {

		console.log(req.file);
		console.log(req.body);
		res.json('kiya khayal ha');
		// var sql = "INSERT INTO posts (post_title, post_desc, post_lat, post_lng, user_id) VALUES (?, ?, ?, ?, ?)";
		// var inserts = [req.body.postTitle, req.body.postDesc, req.body.postLat, req.body.postLng, req.body.userId];
		// sql = mysql.format(sql, inserts);
		// console.log(sql);
		// connection.query(sql, function(error, results) {
		// 	res.json(results);
		// 	connection.release();
		// 	if(error) throw error;
		// });
	});
});


module.exports = router;