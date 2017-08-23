var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var multer = require('multer');

var pool = require('./dbconnection');
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, '/app/public/videos/postVideos/')
	},
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '_' + Date.now() + '.mp4')
	}
})

var upload = multer({ storage: storage})

router.post('/postVideos', upload.single('video'), function(req, res) {
	
	var userId 				= req.body.userId;
	var postTitle 			= req.body.postTitle;
	var postDesc 			= req.body.postDesc;
	var postLat 			= req.body.postLat;
	var postLng 			= req.body.postLng;
	var postMediaType 		= req.body.postMediaType;
	var postMediaFileName 	= req.file.filename;
	var postMediaFilePath 	= req.file.destination;
	var postMediaFileURL 	= req.file.path;

	var inserts = [postTitle, postDesc, postLat, postLng, postMediaType, postMediaFileName, postMediaFilePath, postMediaFileURL, userId];
	var sql = "INSERT INTO posts (postTitle, postDesc, postLat, postLng, postMediaType, postMediaFileName, postMediaFilePath, postMediaFileURL, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
	sql = mysql.format(sql, inserts);
	console.log(sql);

	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results) {
			connection.release();
			results.message('Successfull!!');
			res.json(results);
			if(error) throw error;
		})
	})
})

module.exports = router;


