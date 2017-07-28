var express = require('express');
var mysql = require('mysql');

const dbcon = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'dod'
});

dbcon.connect();

var exports = module.exports = {};

exports.testing = function () {
	return 'inside users';
};

exports.getAllUsers = function () {
	var sql = 'SELECT * FROM user where user_id=2';
	var data;
	dbcon.query(sql, function (err, rows) {
  		if (err) {
  			console.log(err);
  		}
  		var str = JSON.stringify(rows);
        data = JSON.parse(str);
        console.log('done');
	});
    console.log(data);
};

// const dbcon = mysql.createConnection({
// 	host : 'localhost',
// 	user : 'root',
// 	password : '',
// 	database : 'dod'
// });

// dbcon.connect();

// var getAllUsers = function() {
// 	var sql = 'SELECT * FROM user where user_id=1';
// 	dbcon.query(sql, function (err, rows) {
//   		if (err){
//   			console.log(err);
//   		}
//   		console.log(rows);
// 	});
// };


// dbcon.end();

