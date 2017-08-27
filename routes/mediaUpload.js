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

// var storagePath = '/app/public/images/postImages/';
// // var upload = multer({dest: storagePath})


router.post('/postImages', upload.single('image'), function(req, res) {
	
	// for(x in postCat) {
	// 	var sql = "INSERT INTO postCategoryAssociation (catId, postId, userId) VALUES (?, ?, ?)"
	// 	var inserts = []
	// }
	// res.send(req.body.postCategories);

	
	var x ;
	var userId 				= req.body.userId;
	var postTitle 			= req.body.postTitle;
	var postDesc 			= req.body.postDesc;
	var postLat 			= req.body.postLat;
	var postLng 			= req.body.postLng;
	var postMediaType 		= req.body.postMediaType;
	var postMediaFileName 	= req.file.filename;
	var postMediaFilePath 	= req.file.destination;
	var postMediaFileURL 	= req.file.path;
	var postCat 			= JSON.parse(req.body.postCategories);
	postMediaFileURL 		= postMediaFileURL.substring(postMediaFileURL.indexOf('images/'), postMediaFileURL.length);


	var inserts = [postTitle, postDesc, postLat, postLng, postMediaType, postMediaFileName, postMediaFilePath, postMediaFileURL, userId];
	var sql = "INSERT INTO posts (postTitle, postDesc, postLat, postLng, postMediaType, postMediaFileName, postMediaFilePath, postMediaFileURL, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
	sql = mysql.format(sql, inserts);

	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results) {
			connection.release();
			var postId = results.insertedId;
			console.log(results);
			res.send(results);
			if(error) throw error;
		});
	});
});

// router.get('/testing', function(req, res) {
// 	var abc = 
// })

module.exports = router;