var mysql = require('mysql');

// var pool  = mysql.createPool({
//   connectionLimit : 100,
//   host            : 'localhost',
//   user            : 'root',
//   password        : '',
//   database        : 'dod'
// });


var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'bmsyhziszmhf61g1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user            : 'h5ocpja96rcsw4ty',
  password        : 'imb4p0bzzf8ek5ho',
  database        : 'a701xr7ranlad92f'
});

module.exports = pool;