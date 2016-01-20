var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'demo',
  password : 'demo',
  database : 'demo'
});
connection.connect();
