var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer = require('multer');
var pool = require('./dbconnection');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/app/public/images/postImages/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.jpg')
  }
})
 
var upload = multer({ storage: storage })

router.post('/postImages', upload.single('image'), function(req, res) {
	
	var userId 				= req.body.userId;
	var postTitle 			= req.body.postTitle;
	var postDesc 			= req.body.postDesc;
	var postLat 			= req.body.postLat;
	var postLng 			= req.body.postLng;
	var postMediaType 		= req.body.postMediaType;
	var postMediaFileName 	= req.file.filename;
	var postMediaFilePath 	= req.file.destination;
	var postMediaFileURL 	= req.file.path;
	var postCategories 		= JSON.parse(req.body.postCategories);
	postMediaFileURL 		= postMediaFileURL.substring(postMediaFileURL.indexOf('images/'), postMediaFileURL.length);


	var inserts = [postTitle, postDesc, postLat, postLng, postMediaType, postMediaFileName, postMediaFilePath, postMediaFileURL, userId];
	var sql = "INSERT INTO posts (postTitle, postDesc, postLat, postLng, postMediaType, postMediaFileName, postMediaFilePath, postMediaFileURL, userId, postedTime, postedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURTIME(), CURDATE())";
	sql = mysql.format(sql, inserts);
	var sql2 = "INSERT INTO postCategoryAssociation (catId, postId, userId) VALUES (?, ?, ?)"

	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results) {
			var postId 	= results.insertId;
			var sql2;
			var inserts2;
			var x ;
			for(x in postCategories) {
				sql2 	 = "INSERT INTO postCategoryAssociation (catId, postId, userId) VALUES (?, ?, ?)"
				inserts2 = [postCategories[x], postId, userId];
				console.log(inserts2);
				sql2 = mysql.format(sql2, inserts2);
				console.log(sql2);
				connection.query(sql2, function(error2, results2) {
					if(error2) throw error2;
				})
			}
			connection.release();
			res.send(results);
			if(error) throw error;
		});
	});
});


module.exports = router;