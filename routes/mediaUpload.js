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

var storagePath = '/app/public/images/postImages/';
// var upload = multer({dest: storagePath})


router.post('/postImages', upload.single('image'), function(req, res) {
	pool.getConnection(function(err, connection) {

		var body = req.body;
		var file = req.file;
		console.log(file);
		// console.log('han bhai req.file: ',req.file);
		// console.log('han bhai req.body: ',req.body);
		res.json([body, file]);
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