var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var pool = require('./dbconnection');

router.get('/', function(req, res) {
    var sql = 'SELECT categoryId, categoryName From category';
    pool.getConnection(function(error, connection) {
        if (error) res.json(error);
        else {
            connection.query(sql, function(err, results) {
                if(err) res.json(err);
                else {
                    res.json(results);
                }
            })
        }
        
    })
})

router.get('/:userId', function(req, res) {
	var userId = req.params.userId;
	var sql = 'SELECT categoryId From userSubscription WHERE userId = ?';
	var inserts = [userId];
	sql = mysql.format(sql, inserts);
	pool.getConnection(function(error, connection) {
        if(error) res.json(error);
        else {
            connection.query(sql, function(err, results) {
                connection.release();
                if(err) res.json(err);
                else {
                    res.json(results);
                }
            })
        }
	})
})

module.exports = router;