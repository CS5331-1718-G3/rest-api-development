var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'password',
  database : 'mysql'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
