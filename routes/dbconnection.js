var mysql = require('mysql');

// var pool  = mysql.createPool({
//   connectionLimit : 100,
//   host            : 'localhost',
//   user            : 'root',
//   password        : '',
//   database        : 'a701xr7ranlad92f'
// });


var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'bmsyhziszmhf61g1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user            : 'h5ocpja96rcsw4ty',
  password        : 'cd7d2et236n64btx',
  database        : 'a701xr7ranlad92f'
});

// console.log(pool);

module.exports = pool;