var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = require('./dbconnection');

router.post('/postImages', function(req, res) {
	pool.getConnection(function(err, connection) {
		if (!req.files)
			return res.status(400).send('No files were uploaded.');

		// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
		let imageFile = req.files.image;

		// Use the mv() method to place the file somewhere on your server 
		imageFile.mv('/images/post/abc.jpg', function(err) {
			if (err)
			return res.status(500).send(err);
			res.send('File uploaded!');
		})

		// console.log(req.files);
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