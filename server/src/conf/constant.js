/**
 * @description 配置文件
 * @author Z
 */
// mysql
MYSQL_CONFIG={
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'supermarket'
}
// jwt secret 
SECRET='zsy';
module.exports={
    MYSQL_CONFIG,
    SECRET
}
