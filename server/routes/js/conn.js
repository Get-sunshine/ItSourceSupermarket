const mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'supermarket'
});
connection.connect();
console.log('数据库连接成功！');
module.exports=connection;