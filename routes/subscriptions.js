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
	var sql = 'SELECT us.categoryId, c.categoryName From userSubscription us INNER JOIN category c ON us.categoryId = c.categoryId WHERE userId = ?';
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

router.put('/', function(req, res) {
    var inserts;
    var del = req.body.del;
    var ins = req.body.ins;
    var userId = req.body.userId;
    console.log(req.body);
    var sqlForDel = 'DELETE FROM userSubscription WHERE userId = ? AND categoryId = ?';
    var sqlForIns = 'INSERT INTO userSubscription (userId, categoryId) VALUES (?, ?)';
    pool.getConnection(function(error, connection) {
        if(error) res.json(error);
        else {
            if (del.length > 0) {
                for (let item of del) {
                    inserts = [userId, item];
                    sql = mysql.format(sqlForDel, inserts); 
                    connection.query(sql, function(err, results) {
                        console.log('del statment: ',results);
                        if(err) res.json(err);
                    })
                }
            }
            if (ins.length > 0) {
                for (let item of ins) {
                    inserts = [userId, item];
                    sql = mysql.format(sqlForIns, inserts); 
                    connection.query(sql, function(err, results) {
                        console.log('insert statment: ',results);
                        if(err) res.json(err);
                    })
                }
            }
            connection.release();
            res.json({message: 'Subscriptions are updated!'});
        }
    })
})

module.exports = router;