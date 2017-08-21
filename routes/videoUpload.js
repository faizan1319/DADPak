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
		cd(null, file.fieldname + '_' + Date.now() + '.mp4')
	}
})

var upload = multer({ storage: storage})

router.post('/postVideos', upload.single('video'), function(req, res) {
	pool.getConnection(function(err, connection) {
		var body = req.body;
		var file = req.file;
		console.log(file);
		// console.log('han bhai req.file: ',req.file);
		// console.log('han bhai req.body: ',req.body);
		res.json([body, file]);
		// connection.query(sql, function(error, results) {

		// })
	})
})

module.exports = router;


