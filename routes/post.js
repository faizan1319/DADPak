var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = require('./dbconnection');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('in posts');
});

router.get('/trending', function(req, res) {
	pool.getConnection(function(err, connection) {
		var sql = "SELECT u.username, u.dpUrl, p.postId, p.postMediaType, p.postMediaFileURL, p.postTitle, p.postDesc, p.postLat, p.postLng, p.postLikes, p.postDislikes, p.postCommentCount, p.userId, DATEDIFF(CURRENT_DATE(), postedDate) AS dateDiff, TIMEDIFF(CURRENT_TIME(), postedTime) AS timeDiff FROM posts p INNER JOIN user u ON p.userId = u.userId ORDER BY postCommentCount DESC LIMIT 7";
		connection.query(sql, function(error, results) {
			var sql2;
			var inserts2;
			var loopCount = results.length;
			for(let x = 0 ; x < loopCount ; x++) {
				sql2 = "SELECT pca.categoryId, c.categoryName FROM category c INNER JOIN postCategoryAssociation pca ON c.categoryId = pca.categoryId WHERE pca.postId = ?"
				inserts2 = [results[x].postId];
				sql2 = mysql.format(sql2, inserts2);
				connection.query(sql2, function(error2, results2) {
					if(results2.length != 0 ) {
						results[x]['postCategories'] = results2;
					}
					if(x == (loopCount -1)) {
						res.json(results);
					}
				})
			}
			connection.release();
			if(error) throw error;
		});
	});
});

router.get('/getPostByUserId/:userId', function(req, res) {
	var userId = req.params.userId;
	var sql = "SELECT postId, postMediaType, postMediaFileURL, postTitle, postDesc, postLat, postLng, postLikes, postDislikes, postCommentCount, DATEDIFF(CURRENT_DATE(), postedDate) AS dateDiff, TIMEDIFF(CURRENT_TIME(), postedTime) AS timeDiff FROM posts WHERE userId = ? ORDER BY dateDiff, timeDiff";
	var inserts = [userId];
	sql = mysql.format(sql, inserts);
	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results) {
			var sql2;
			var inserts2;
			var loopCount = results.length;
			for(let x = 0 ; x < loopCount ; x++) {
				sql2 = "SELECT pca.categoryId, c.categoryName FROM category c INNER JOIN postCategoryAssociation pca ON c.categoryId = pca.categoryId WHERE pca.postId = ?"
				inserts2 = [results[x].postId];
				sql2 = mysql.format(sql2, inserts2);
				connection.query(sql2, function(error2, results2) {
					if(results2.length != 0 ) {
						results[x]['postCategories'] = results2;
					}
					if(x == (loopCount -1)) {
						res.json(results);
					}
				})
			}
			// for(x in results) {
			// 	sql2 = "SELECT pca.catId, c.categoryName FROM category c INNER JOIN postCategoryAssociation pca ON c.categoryId = pca.catId WHERE pca.postId = ?"
			// 	inserts2 = [results[x].postId];
			// 	sql2 = mysql.format(sql2, inserts2);
			// 	// console.log('x: ',x,'query: ',sql2);
			// 	connection.query(sql2, function(error2, results2) {
			// 		if(results2.length != 0 ) {
			// 			console.log('data: ',results2);
			// 			results[x]['postCategories'] = results2;
			// 			// console.log('yelo: ',results[x]);
			// 		}
			// 	})
			// }
			connection.release();
			if(error) throw error;
			// res.json(results);
		})
	})
})

router.get('/getUserSubscriptionPosts/:userId', function(req, res) {
	var userId = req.params.userId;
	var sql = "SELECT u.username, u.dpUrl, pca.postId, p.postMediaType, p.postMediaFileURL, p.postTitle, p.postDesc, p.postLat, p.postLng, p.postLikes, p.postDislikes, p.postCommentCount, DATEDIFF(CURRENT_DATE(), p.postedDate) AS DATEDIFF, TIMEDIFF(CURRENT_TIME(), p.postedTime) AS TIMEDIFF, us.categoryId FROM user u INNER JOIN posts p ON p.userId = u.userId INNER JOIN postCategoryAssociation pca ON p.postId = pca.postId INNER JOIN userSubscription us ON us.categoryId = pca.categoryId WHERE us.userId = ? GROUP BY pca.postId";
	var inserts = [userId];
	sql = mysql.format(sql, inserts);
	pool.getConnection(function(error, connection) {
		connection.query(sql, function(err, results) {
			var sql2;
			var inserts2;
			var loopCount = results.length;
			for(let x = 0 ; x < loopCount ; x++) {
				sql2 = "SELECT pca.categoryId, c.categoryName FROM category c INNER JOIN postCategoryAssociation pca ON c.categoryId = pca.categoryId WHERE pca.postId = ?"
				inserts2 = [results[x].postId];
				sql2 = mysql.format(sql2, inserts2);
				connection.query(sql2, function(error2, results2) {
					if(results2.length != 0 ) {
						results[x]['postCategories'] = results2;
					}
					if(x == (loopCount -1)) {
						res.json(results);
					}
				})
			}
			connection.release();
			if(error) throw error;
		})
	})
})

router.get('/getPostForEmployee/:categoryId', function(req, res) {
	var categoryId = req.params.categoryId;
	var inserts = [categoryId];
	var sql = 'SELECT pca.postId, p.postMediaType, p.postMediaFileURL, p.postTitle, p.postDesc, p.postLat, p.postLng, p.postLikes, p.postDislikes, p.postCommentCount, DATEDIFF(CURRENT_DATE(), p.postedDate) AS DATEDIFF, TIMEDIFF(CURRENT_TIME(), p.postedTime) AS TIMEDIFF FROM posts p INNER JOIN  postCategoryAssociation pca ON p.postId = pca.postId WHERE pca.categoryId = ?';
	sql = mysql.format(sql, inserts)
	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results) {
			var sql2;
			var inserts2;
			var loopCount = results.length;
			for(let x = 0 ; x < loopCount ; x++) {
				sql2 = "SELECT pca.categoryId, c.categoryName FROM category c INNER JOIN postCategoryAssociation pca ON c.categoryId = pca.categoryId WHERE pca.postId = ?"
				inserts2 = [results[x].postId];
				sql2 = mysql.format(sql2, inserts2);
				connection.query(sql2, function(error2, results2) {
					if(results2.length != 0 ) {
						results[x]['postCategories'] = results2;
					}
					if(x == (loopCount -1)) {
						res.json(results);
					}
				})
			}
			connection.release();
			if(error) throw error;
		})
	})
})


module.exports = router;
